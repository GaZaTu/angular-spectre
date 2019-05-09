import { Injectable, TemplateRef, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, from as observableFrom, of as observableOf, SubscriptionLike, combineLatest } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ModalService } from '../modal';
import { TryOrToast, ToastService } from '../toast';
import { ConfigService } from '../config';

interface ProgressEvent {
  loaded: number
  total?: number
}

export interface GenericApi<T = any> {
  path?: string
  schema?: string
  table?: string
  idKey?: keyof T
  loading?: Observable<boolean>
  progress?: Observable<ProgressEvent>
  get?: (query: any) => T[] | Promise<T[]> | Observable<T[]>
  post?: (data: Partial<T>) => T | Promise<T> | Observable<T>
  id?: (id: any) => {
    get?: () => T | Promise<T> | Observable<T>
    put?: (data: Partial<T>) => void | Promise<void> | Observable<void>
    delete?: () => void | Promise<void> | Observable<void>
  }
  defaultValues?: () => Partial<T> | Promise<Partial<T>> | Observable<Partial<T>>
}

function normalizeAsyncResult<T>(result: T | Promise<T> | Observable<T>) {
  if (result instanceof Observable) {
    return result
  } else if (result instanceof Promise) {
    return observableFrom(result)
  } else {
    return observableOf(result)
  }
}

// @dynamic
@Injectable()
export class TablemanagerService<T = any> implements OnDestroy {
  _api: GenericApi<T>

  _path: string
  _schema: string
  _table: string
  _idKey: keyof T
  _tableCols: any[]
  _formGroup: FormGroup

  _rows = [] as T[]
  _selectedRows = [] as T[]
  _onMask = false
  _formGroupSubscription?: SubscriptionLike

  tableContextMenu?: TemplateRef<any>

  lastRefresh = 0
  id?: string

  changes = new BehaviorSubject<any>({})

  ngOnDestroy() {
    if (this._formGroupSubscription) {
      this._formGroupSubscription.unsubscribe()
    }
  }

  setState(newState: Partial<TablemanagerService>) {
    Object.assign(this, newState)
    this.changes.next(newState)
  }

  get api() {
    return this._api
  }

  set api(value) {
    this.setState({
      _api: value,
      _path: value.path || this.path,
      _schema: value.schema || this.schema,
      _table: value.table || this.table,
      _idKey: value.idKey || this.idKey,
    })
  }

  get path() {
    return this._path
  }

  set path(value) {
    this.setState({
      _path: value,
    })
  }

  get schema() {
    return this._schema
  }

  set schema(value) {
    this.setState({
      _schema: value,
    })
  }

  get table() {
    return this._table
  }

  set table(value) {
    this.setState({
      _table: value,
    })
  }

  get idKey() {
    return this._idKey
  }

  set idKey(value) {
    this.setState({
      _idKey: value,
    })
  }

  get tableCols() {
    return this._tableCols
  }

  set tableCols(value) {
    this.setState({
      _tableCols: value,
    })
  }

  get formGroup() {
    return this._formGroup
  }

  set formGroup(value) {
    if (this._formGroupSubscription) {
      this._formGroupSubscription.unsubscribe()
    }

    this._formGroupSubscription = combineLatest([
      value.valueChanges,
      value.statusChanges,
    ]).subscribe(() => this.changes.next({}))

    this.setState({
      _formGroup: value,
    })
  }

  get rows() {
    return this._rows
  }

  set rows(value) {
    this.setState({
      _rows: value,
    })
  }

  get selectedRows() {
    return this._selectedRows
  }

  set selectedRows(value) {
    this.setState({
      _selectedRows: value,
    })
  }

  get curRow() {
    return this.selectedRows.length === 1 ? this.selectedRows[0] : undefined
  }

  set curRow(value) {
    this.setState({
      _selectedRows: [value],
    })
  }

  get onMask() {
    return this._onMask
  }

  set onMask(value) {
    this.setState({
      _onMask: value,
    })
  }

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public toastService: ToastService,
    public modalService: ModalService,
    public configService: ConfigService,
  ) { }

  async checkFormGroup() {
    if (this.onMask && this.formGroup && this.formGroup.dirty) {
      const doSaveChanges = confirm(this.configService.get('tablemanager.saveUnsavedChanges'))

      if (doSaveChanges) {
        await this.save()
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  }

  async navigateToList() {
    if (!await this.checkFormGroup()) {
      return
    }

    this.formGroup.reset()
    this.setState({
      onMask: undefined,
    })

    return this.router.navigate([this.path])
  }

  async navigateToMask(row = this.curRow) {
    if (!await this.checkFormGroup()) {
      return
    }

    this.setState({
      curRow: row,
      onMask: true,
    })

    const navigated = await this.router.navigate([this.path, this.idValue])

    this.formGroup.patchValue(row)

    return navigated
  }

  async navigateToNew() {
    if (!await this.checkFormGroup()) {
      return
    }

    this.setState({
      onMask: true,
    })

    return this.router.navigate([this.path, 'new'])
  }

  async navigateToCopy(row = this.curRow) {
    if (!await this.checkFormGroup()) {
      return
    }

    this.setState({
      onMask: true,
    })

    return this.router.navigate([this.path, 'new'], { queryParams: { copy: this.getIdValueOf(row) } })
  }

  async delete(rows = this.selectedRows) {
    const doDeleteRows = await this.modalService.confirm(this.configService.get('tablemanager.confirmDelete'))

    if (!doDeleteRows) {
      return
    }

    const promises = rows.map(row => {
      return normalizeAsyncResult(this.api.id(this.getIdValueOf(row)).delete()).toPromise()
    })

    this.changes.next({})
    await Promise.all(promises)

    await this.refresh()
    await this.router.navigate([this.path])
  }

  cancel() {

  }

  async save(data = (this.formGroup && this.formGroup.value) as Partial<T>) {
    const id = this.getIdValueOf(data)

    let promise: Promise<any>
    let result: any

    if (id) {
      promise = normalizeAsyncResult(this.api.id(id).put(data)).toPromise()
    } else {
      promise = normalizeAsyncResult(this.api.post(data)).toPromise()
    }

    this.changes.next({})
    result = await promise

    if (this.formGroup && data === this.formGroup.value) {
      this.formGroup.markAsPristine()
      this.formGroup.markAsUntouched()
    }

    if (!id) {
      this.navigateToMask(result)
    }

    await this.refresh()
  }

  @TryOrToast({ stringifyError: res => res.message || res })
  async refreshRows() {
    const observable = normalizeAsyncResult(this.api.get(this.queryParams))

    this.changes.next({})

    await observable.forEach(rows => {
      this.setState({ rows })
    })
  }

  @TryOrToast({ stringifyError: res => res.message || res })
  async refreshMask() {
    let dataSource = {} as Partial<T> | Promise<Partial<T>> | Observable<Partial<T>>
    let dataSourceObservable: Observable<Partial<T>>

    if (this.isNew) {
      if (this.copyFromIdValue) {
        dataSource = this.api.id(this.copyFromIdValue).get()
      } else if (this.api.defaultValues) {
        dataSource = this.api.defaultValues()
      }
    } else {
      dataSource = this.api.id(this.idValue).get()
    }

    dataSourceObservable = normalizeAsyncResult(dataSource)
    this.changes.next({})

    await dataSourceObservable.forEach(data => {
      if (!this.isNew) {
        this.curRow = data as T
      }

      this.formGroup.markAsPristine()
      this.formGroup.markAsUntouched()
      this.formGroup.patchValue(data)
      this.changes.next({})
    })
  }

  async refresh(options = { full: false }) {
    const now = Date.now()

    if (now > this.lastRefresh + 1000) {
      this.setState({
        lastRefresh: now,
      })

      if (!await this.checkFormGroup()) {
        return
      }

      if (this.onMask) {
        await this.refreshMask()
      } else {
        await this.refreshRows()
      }

      if (this.onMask && options.full) {
        setTimeout(() => this.refreshRows())
      }
    }
  }

  async goTo(row = this.curRow) {
    if (!await this.checkFormGroup()) {
      return
    }

    this.setState({
      curRow: row,
    })

    if (this.onMask) {
      await this.navigateToMask(this.curRow)
    }
  }

  goToIdx(idx = this.getIndexOfRow(this.curRow)) {
    return this.goTo(this.rows[idx])
  }

  goToFirst() {
    return this.goToIdx(0)
  }

  goToPrevious() {
    return this.goToIdx(this.getIndexOfRow(this.curRow) - 1)
  }

  goToNext() {
    return this.goToIdx(this.getIndexOfRow(this.curRow) + 1)
  }

  goToLast() {
    return this.goToIdx(this.rows.length - 1)
  }

  get canNavigateToList() {
    return this.onMask
  }

  get canNavigateToMask() {
    return !this.onMask && this.curRow
  }

  get canNavigateToNew() {
    return this.canApiPost
  }

  get canNavigateToCopy() {
    return this.canNavigateToNew && !!this.curRow
  }

  get canDelete() {
    return this.canApiDelete
  }

  get canNavigateToExisting() {
    return !this.onMask && this.canApiPut
  }

  get canCancel() {
    return false
  }

  get canSave() {
    // tslint:disable-next-line:max-line-length
    return this.onMask && this.formGroup && this.formGroup.valid && !this.formGroup.pending && this.formGroup.dirty && (this.idValue ? this.canApiPut : this.canApiPost)
  }

  get canRefresh() {
    return true
  }

  get canGoToFirst() {
    return this.canGoToPrevious
  }

  get canGoToPrevious() {
    return (this.rows.length && this.curRow && this.getIndexOfRow() > 0)
  }

  get canGoToNext() {
    return (this.rows.length && this.curRow && this.getIndexOfRow() < this.rows.length - 1)
  }

  get canGoToLast() {
    return this.canGoToNext
  }

  get canApiGetAll() {
    return !!this.api && !!this.api.get
  }

  get canApiPost() {
    return !!this.api && !!this.api.post
  }

  get canApiGetOne() {
    return !!this.api && !!this.api.id && !!this.api.id(null).get && this.selectedRows.length > 0
  }

  get canApiPut() {
    return !!this.api && !!this.api.id && !!this.api.id(null).put && this.selectedRows.length > 0
  }

  get canApiDelete() {
    return !!this.api && !!this.api.id && !!this.api.id(null).delete && this.selectedRows.length > 0
  }

  getIndexOfRow(row = this.curRow) {
    if (row) {
      if (this.idKey) {
        return this.rows.findIndex(r => r[this.idKey] === row[this.idKey])
      } else {
        return this.rows.indexOf(row)
      }
    }

    return -1
  }

  async applyDefaultValues() {
    if (this.api.defaultValues) {
      const defaultValues = await normalizeAsyncResult(this.api.defaultValues()).toPromise()

      this.formGroup.patchValue(
        Object.assign(defaultValues, { [this.idKey]: undefined })
      )

      return this.formGroup.value
    } else {
      return {} as Partial<T>
    }
  }

  getIdValueOf(row?: Partial<T>) {
    return (this.idKey && row) ? row[this.idKey] : undefined
  }

  get idValue() {
    return this.getIdValueOf(this.curRow) || this.id
  }

  get isNew() {
    return this.idValue as any === 'new'
  }

  get copyFromIdValue() {
    return this.queryParams.copy
  }

  get params() {
    return this.activatedRoute.snapshot.params
  }

  get queryParams() {
    return this.activatedRoute.snapshot.queryParams
  }

  get loading() {
    return this.api.loading !== undefined ? this.api.loading : undefined
  }

  get newNavigationLink() {
    return {
      path: [this.path, 'new'],
      queryParams: {},
      fragment: '',
    }
  }

  get copyNavigationLink() {
    return {
      path: [this.path, 'new'],
      queryParams: { copy: this.idValue },
      fragment: '',
    }
  }

  get listNavigationLink() {
    return {
      path: [this.path],
      queryParams: {},
      fragment: '',
    }
  }

  get maskNavigationLink() {
    return {
      path: [this.path, this.idValue],
      queryParams: {},
      fragment: '',
    }
  }

  get firstNavigationLink() {
    if (!this.curRow) {
      return {}
    }

    return {
      path: [this.path, this.getIdValueOf(this.rows[0])],
      queryParams: {},
      fragment: '',
    }
  }

  get previousNavigationLink() {
    if (!this.curRow) {
      return {}
    }

    return {
      path: [this.path, this.getIdValueOf(this.rows[this.getIndexOfRow(this.curRow) - 1])],
      queryParams: {},
      fragment: '',
    }
  }

  get nextNavigationLink() {
    if (!this.curRow) {
      return {}
    }

    return {
      path: [this.path, this.getIdValueOf(this.rows[this.getIndexOfRow(this.curRow) + 1])],
      queryParams: {},
      fragment: '',
    }
  }

  get lastNavigationLink() {
    if (!this.curRow) {
      return {}
    }

    return {
      path: [this.path, this.getIdValueOf(this.rows[this.rows.length - 1])],
      queryParams: {},
      fragment: '',
    }
  }
}
