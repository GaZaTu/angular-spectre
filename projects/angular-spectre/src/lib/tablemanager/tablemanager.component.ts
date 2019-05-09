// tslint:disable-next-line:max-line-length
import { Component, OnInit, OnDestroy, AfterViewInit, AfterContentInit, OnChanges, Input, TemplateRef, ViewChild, ContentChild, ChangeDetectorRef } from '@angular/core';
import { TablemanagerService, GenericApi } from './tablemanager.service';
import { Subscribe } from '../../utils';
import { ActivatedRoute } from '@angular/router';
import { UnsavedChangesGuardDecorator } from '../form/unsaved-changes/utils';
import { TablemanagerRouterOutletDirective } from './tablemanager.directives';
import { SubscriptionLike } from 'rxjs';

// @dynamic
@UnsavedChangesGuardDecorator()
@Component({
  selector: 'spectre-tablemanager',
  templateUrl: './tablemanager.component.html',
  styleUrls: ['./tablemanager.component.scss'],
  providers: [TablemanagerService],
})
export class TablemanagerComponent<T = any> implements OnInit, OnDestroy, AfterViewInit, AfterContentInit, OnChanges {
  @Input()
  path: string
  @Input()
  schema: string
  @Input()
  table: string
  @Input()
  idKey: keyof T = `${this.table}_ID` as any
  @Input()
  api: GenericApi<T>

  @ContentChild(TablemanagerRouterOutletDirective, { read: TemplateRef })
  routerOutlet?: TemplateRef<any>

  @ViewChild('tableContextMenu')
  tableContextMenu?: TemplateRef<any>

  loading?: boolean
  progress?: { loaded: number, total?: number }

  assignedSubscriptions = false

  subscriptions = {
    loading: undefined as SubscriptionLike | undefined,
    progress: undefined as SubscriptionLike | undefined,
  }

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public route: ActivatedRoute,
    public service: TablemanagerService,
  ) {
    this.changeDetectorRef.detach()
  }

  ngOnInit() {
    this.updateService()
  }

  ngAfterViewInit() {
    this.updateService()
  }

  ngAfterContentInit() {
    this.changeDetectorRef.detectChanges()
  }

  ngOnDestroy() {
    this.clearSubscriptions()
  }

  ngOnChanges() {
    this.updateService()
  }

  @Subscribe((self: TablemanagerComponent) => self.route.params)
  @Subscribe((self: TablemanagerComponent) => self.route.queryParams)
  onRouteChange() {
    this.refreshService()
  }

  @Subscribe((self: TablemanagerComponent) => self.service.changes)
  onServiceChange() {
    if (!this.assignedSubscriptions && this.service.api) {
      this.assignedSubscriptions = true

      if (this.service.api.loading) {
        this.subscriptions.loading = this.service.api.loading.subscribe(loading => {
          this.loading = loading
          this.progress = loading ? this.progress : undefined
          this.changeDetectorRef.detectChanges()
        })
      }

      if (this.service.api.progress) {
        this.subscriptions.progress = this.service.api.progress.subscribe(progress => {
          if (progress.total) {
            this.progress = (progress.loaded === progress.total) ? undefined : progress
            this.changeDetectorRef.detectChanges()
          }
        })
      }
    }

    this.changeDetectorRef.detectChanges()
  }

  updateService() {
    Object.assign(this.service, this)
    this.changeDetectorRef.detectChanges()
  }

  async refreshService() {
    this.changeDetectorRef.detectChanges()
    await this.service.refresh()
    this.changeDetectorRef.detectChanges()
  }

  navigateToNew(event: Event) {
    event.preventDefault()
    this.service.navigateToNew()
  }

  navigateToCopy(event: Event) {
    event.preventDefault()
    this.service.navigateToCopy()
  }

  navigateToList(event: Event) {
    event.preventDefault()
    this.service.navigateToList()
  }

  navigateToMask(event: Event) {
    event.preventDefault()
    this.service.navigateToMask()
  }

  goToFirst(event: Event) {
    event.preventDefault()
    this.service.goToFirst()
  }

  goToPrevious(event: Event) {
    event.preventDefault()
    this.service.goToPrevious()
  }

  goToNext(event: Event) {
    event.preventDefault()
    this.service.goToNext()
  }

  goToLast(event: Event) {
    event.preventDefault()
    this.service.goToLast()
  }

  clearSubscriptions() {
    for (const subscription of Object.values(this.subscriptions)) {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }

  get form() {
    return this.service.formGroup
  }
}
