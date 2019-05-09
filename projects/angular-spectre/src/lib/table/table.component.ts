// tslint:disable-next-line:max-line-length
import { Component, OnInit, OnDestroy, AfterContentInit, Input, ContentChildren, QueryList, TemplateRef, ChangeDetectorRef, OnChanges, Output, EventEmitter, ContentChild, HostListener } from '@angular/core';
import classNames from 'classnames';
import { TableColumnComponent } from './table-column/table-column.component';
import { Subscribe } from '../../utils';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Observable, SubscriptionLike } from 'rxjs';
import { ConfigService } from '../config';
import { TableCaptionDirective, TableEmptyDirective, TableFooterDirective, TableRowDetailDirective } from './table.directives';

interface ColumnMetaData {
  [key: string]: {
    sortDir?: number
    filter?: {
      value: string | string[]
      exact: boolean
    }
    index?: number
    hidden?: boolean
    flex?: number
    minWidth?: string
  }
}

interface RowMetaData {
  [key: string]: {
    canExpand?: boolean
    expanded?: boolean
    selected?: boolean
  }
}

// @dynamic
@Component({
  selector: 'spectre-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<T = any> implements OnInit, OnDestroy, AfterContentInit, OnChanges {
  @Input()
  set data(value: T[] | Promise<T[]> | Observable<T[]> | undefined) {
    const setLoading = (value instanceof Promise || value instanceof Observable)
    const update = (data?: T[]) => {
      if (data === this.rawData) {
        return
      }

      this.rawData = data || []
      this.selection = []

      if (setLoading) {
        this.loading = false
      }

      this.updateColumnFilterOptions()
      this.updateFilteredData()
      this.selectionChange.emit([])
    }

    if (setLoading) {
      this.loading = true
      this.changeDetectorRef.detectChanges()
    }

    if (value instanceof Observable) {
      if (this.dataSubscription) {
        this.dataSubscription.unsubscribe()
      }

      this.dataSubscription = value.subscribe(update)
    } else if (value instanceof Promise) {
      value.then(update)
    } else {
      update(value)
    }
  }

  @Input()
  horizontal = false
  @Input()
  striped = false
  @Input()
  hoverable = false
  @Input()
  scrollable = false
  @Input()
  loading = false
  @Input()
  nested = false
  @Input()
  hideHead = false
  @Input()
  hideHeadOnMobile = false
  @Input()
  forceDesktopMode = false
  @Input()
  pageSize = this.nested ? 250 : 25
  @Input()
  maxHeight = this.nested ? 'unset' : '70vh'

  @Input()
  rowSpectreContextMenu?: TemplateRef<any>

  @Input()
  trackBy?: (row: T) => any
  @Input()
  set trackByKey(key: keyof T) {
    this.trackBy = (row: T) => row[key]
    this.changeDetectorRef.detectChanges()
  }

  @Input()
  rowCanExpand?: (row: T) => boolean
  @Input()
  set rowCanExpandIfKey(key: keyof T) {
    this.rowCanExpand = (row: T) => !!row[key]
    this.changeDetectorRef.detectChanges()
  }

  @Input()
  class?: string

  @Input()
  set selection(data: T[] | undefined) {
    if (this.trackBy) {
      data = data || []

      for (const [key, row] of Object.entries(this.rowMetaData)) {
        row.selected = false
      }

      data
        .forEach(row => {
          this.rowMetaData[this.trackBy(row)].selected = true
        })

      this.changeDetectorRef.detectChanges()
    }
  }

  get selection() {
    return this.filteredData
      .filter((row, rowIndex) => {
        return this.rowMetaData[this.trackRowBy(rowIndex, row)].selected
      })
  }

  @Output()
  selectionChange = new EventEmitter<T[]>()

  @ContentChildren(TableColumnComponent)
  columns?: QueryList<TableColumnComponent>

  @ContentChild(TableCaptionDirective, { read: TemplateRef })
  captionTemplate?: TemplateRef<any>
  @ContentChild(TableEmptyDirective, { read: TemplateRef })
  emptyTemplate?: TemplateRef<any>
  @ContentChild(TableFooterDirective, { read: TemplateRef })
  footerTemplate?: TemplateRef<any>
  @ContentChild(TableRowDetailDirective, { read: TemplateRef })
  rowDetailTemplate?: TemplateRef<any>

  tableMetaData = new Proxy({
    page: 0,
    autosaveColumns: false,
    autoloadColumns: false,
    noWhitespaceWrap: false,
    showFulltextsearch: false,
  }, {
    set: (data, p, v) => {
      data[p] = v

      this.cacheData = Object.assign({}, this.cacheData, {
        tableMetaData: data,
      })

      this.changeDetectorRef.detectChanges()

      return true
    },
  })

  columnMetaData = new Proxy({}, {
    get: (data, p) => {
      return (data[p] = data[p] || {})
    },
  }) as ColumnMetaData

  rowMetaData = new Proxy({}, {
    get: (data, p) => {
      return (data[p] = data[p] || {})
    },
  }) as RowMetaData

  orderedColumns = [] as TableColumnComponent[]
  orderedColumnsWithTitle = [] as TableColumnComponent[]
  visibleColumns = [] as TableColumnComponent[]

  rawData = [] as T[]
  filteredData = [] as T[]
  sortedData = [] as T[]
  visibleData = [] as T[]

  pageCount = 0

  cacheId?: string

  dataSubscription?: SubscriptionLike

  unselectable = false

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public configService: ConfigService,
  ) {
    this.changeDetectorRef.detach()
  }

  ngOnInit() { }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe()
    }
  }

  ngAfterContentInit() {
    if (!this.nested) {
      this.initCacheId()
    }

    this.loadTableMetaData()
    this.onColumnsChange()
  }

  ngOnChanges() {
    this.changeDetectorRef.detectChanges()
  }

  @HostListener('window:keydown', ['$event'])
  @HostListener('window:keyup', ['$event'])
  onWindowKeydownAndUp(event: KeyboardEvent) {
    if (event.shiftKey !== this.unselectable) {
      this.unselectable = event.shiftKey
      this.changeDetectorRef.detectChanges()
    }
  }

  @Subscribe((self: TableComponent) => self.configService.data)
  onConfigChange() {
    this.changeDetectorRef.detectChanges()
  }

  @Subscribe((self: TableComponent) => self.columns.changes, { getOn: 'ngAfterContentInit' })
  onColumnsChange() {
    this.columns.forEach((column, index) => {
      const columnMetaData = this.columnMetaData[column.prop]

      columnMetaData.index = columnMetaData.index || index
      columnMetaData.hidden = columnMetaData.hidden || column.hidden
    })

    this.updateOrderedColumns()
    this.updateFilteredData()
  }

  initCacheId() {
    this.cacheId = `table[${this.columns.map(col => col.prop).join('|')}]`
  }

  trackColumnBy(index: number, column: TableColumnComponent) {
    return column.prop
  }

  trackRowBy(index: number, row: T) {
    return this.trackBy ? this.trackBy(row) : String(index)
  }

  onColumnNameClick(event: MouseEvent, column: TableColumnComponent) {
    if (this.nested) {
      return
    }

    const columnMetaData = this.columnMetaData[column.prop]

    if (columnMetaData.sortDir === 1) {
      columnMetaData.sortDir = -1
    } else if (columnMetaData.sortDir === -1) {
      columnMetaData.sortDir = undefined
    } else {
      columnMetaData.sortDir = 1
    }

    if (this.tableMetaData.autosaveColumns) {
      this.saveColumnMetaData()
    }

    this.updateSortedData()
  }

  onFilterChange(column: TableColumnComponent, value: any, options = { exact: false }) {
    if (Array.isArray(value) && value.length === 0) {
      value = ''
    }

    this.columnMetaData[column.prop].filter = {
      value,
      exact: options.exact,
    }

    if (this.tableMetaData.autosaveColumns) {
      this.saveColumnMetaData()
    }

    this.updateFilteredData()
  }

  onToggleColumnVisiblity(column: TableColumnComponent) {
    const columnMetaData = this.columnMetaData[column.prop]

    columnMetaData.hidden = !columnMetaData.hidden

    if (this.tableMetaData.autosaveColumns) {
      this.saveColumnMetaData()
    }

    this.updateVisibleColumns()
    this.updateFilteredData()
  }

  onColumnDropListDropped(event: CdkDragDrop<undefined>) {
    const draggedColumn = this.visibleColumns[event.previousIndex]
    const targetColumn = this.visibleColumns[event.currentIndex]
    const previousIndex = this.columnMetaData[draggedColumn.prop].index
    const currentIndex = this.columnMetaData[targetColumn.prop].index

    this.columnMetaData[draggedColumn.prop].index = currentIndex

    if (currentIndex > previousIndex) {
      for (const column of this.orderedColumns) {
        const columnMetaData = this.columnMetaData[column.prop]

        if (column !== draggedColumn && columnMetaData.index > previousIndex && columnMetaData.index <= currentIndex) {
          columnMetaData.index -= 1
        }
      }
    } else if (currentIndex < previousIndex) {
      for (const column of this.orderedColumns) {
        const columnMetaData = this.columnMetaData[column.prop]

        if (column !== draggedColumn && columnMetaData.index < previousIndex && columnMetaData.index >= currentIndex) {
          columnMetaData.index += 1
        }
      }
    }

    if (this.tableMetaData.autosaveColumns) {
      this.saveColumnMetaData()
    }

    this.updateOrderedColumns()
    this.updateSortedData()
  }

  updateOrderedColumns() {
    this.orderedColumns = this.columns.toArray()
      .sort((a, b) => {
        const aMetaData = this.columnMetaData[a.prop]
        const bMetaData = this.columnMetaData[b.prop]

        if (aMetaData.index < bMetaData.index) {
          return -1
        } else if (aMetaData.index > bMetaData.index) {
          return 1
        } else {
          return 0
        }
      })

    this.orderedColumnsWithTitle = this.orderedColumns
      .filter(col => col.title)

    this.updateVisibleColumns()
  }

  updateVisibleColumns() {
    this.visibleColumns = this.orderedColumns
      .filter(col => !this.columnMetaData[col.prop].hidden)

    this.changeDetectorRef.detectChanges()
  }

  updateFilteredData() {
    const filters = Object.entries(this.columnMetaData)
      .filter(([_, col]) => col.filter && col.filter.value && !col.hidden)
      .map(([prop, colMeta]) => {
        const col = this.columns.find(c => c.prop === prop)

        return Object.assign({}, colMeta.filter, { col })
      })

    this.filteredData = this.rawData
      .filter(row => {
        for (const filter of filters) {
          const filterValues = typeof filter.value === 'string' ? [filter.value] : filter.value
          const colValue = this.getRowValue(row, filter.col)

          let oneMatched = false

          if (filter.col.lookupDataMap) {
            for (const filterValue of filterValues) {
              if (colValue === filterValue) {
                oneMatched = true
                break
              }
            }
          } else {
            for (const filterValue of filterValues) {
              if (filter.exact) {
                if (colValue === filterValue) {
                  oneMatched = true
                  break
                }
              } else {
                if (colValue.toLowerCase().includes(filterValue.toLowerCase())) {
                  oneMatched = true
                  break
                }
              }
            }
          }

          if (!oneMatched) {
            return false
          }
        }

        return true
      })

    this.updateSortedData()
  }

  updateSortedData() {
    const sorts = Object.entries(this.columnMetaData)
      .filter(([_, col]) => (col.sortDir === 1 || col.sortDir === -1) && !col.hidden)
      .map(([prop, colMeta]) => {
        const col = this.columns.find(c => c.prop === prop)

        return Object.assign({}, colMeta, { col })
      })
      .sort((a, b) => {
        if (a.index < b.index) {
          return -1
        } else if (a.index > b.index) {
          return 1
        } else {
          return 0
        }
      })

    if (sorts.length > 0) {
      this.sortedData = this.filteredData.slice()
        .sort((rowA, rowB) => {
          for (const sort of sorts) {
            const colValueA = this.getRowValueRaw(rowA, sort.col)
            const colValueB = this.getRowValueRaw(rowB, sort.col)
            const result = this.sortValues(colValueA, colValueB, sort.sortDir, sort.col.sortFn)

            if (result !== 0) {
              return result
            }
          }

          return 0
        })
    } else {
      this.sortedData = this.filteredData
        .slice()
    }

    this.updateVisibleData()
  }

  updateVisibleData() {
    let start = undefined as number | undefined
    let end = undefined as number | undefined

    if (typeof this.pageSize === 'number') {
      this.pageCount = Math.ceil(this.filteredData.length / this.pageSize)

      if (this.page >= this.pageCount && this.rawData.length > 0) {
        this.page = 0
      }

      start = this.page * this.pageSize
      end = start + this.pageSize
    }

    this.visibleData = this.sortedData
      .slice(start, end)

    if (this.trackBy) {
      for (const row of this.visibleData) {
        this.rowMetaData[this.trackBy(row)].canExpand = this.rowCanExpand ? this.rowCanExpand(row) : true
      }
    }

    this.changeDetectorRef.detectChanges()
  }

  sortValues(a: any, b: any, sortDir = 1, sortFn?: (a: any, b: any) => 0 | 1 | -1): 0 | 1 | -1 {
    if (a === null || a === undefined) {
      return 1 * sortDir as any
    } else if (b === null || b === undefined) {
      return -1 * sortDir as any
    }

    if (sortFn) {
      return sortFn(a, b) * sortDir as any
    } else {
      if (a < b) {
        return -1 * sortDir as any
      } else if (a > b) {
        return 1 * sortDir as any
      } else {
        return 0
      }
    }
  }

  updateColumnFilterOptions() {
    if (this.columns) {
      this.columns
        .filter(c => c.filterKind && c.filterKind.includes('select'))
        .forEach(col => {
          // if (col.lookupDataMap) {
          //   col.filterOptions = Array.from(
          //     col.lookupDataMap.values()
          //   )
          // } else {
            col.filterOptions = Array.from(
              new Set(
                this.rawData.map(r => (
                  this.getRowValue(r, col)
                ))
              )
            ).sort((a, b) => this.sortValues(a, b, 1, col.sortFn))
          // }
        })
    }

    this.changeDetectorRef.detectChanges()
  }

  toggleRowExpansion(row: T) {
    if (this.trackBy) {
      const rowMetaData = this.rowMetaData[this.trackBy(row)]

      rowMetaData.expanded = !rowMetaData.expanded

      this.changeDetectorRef.detectChanges()
    }
  }

  getRowValueRaw(row: T, column: TableColumnComponent) {
    const colValueRaw = row[column.prop] || column.prop.split('.').reduce((o, i) => o ? o[i] : undefined, row)
    const colValueMapped = column.lookupDataMap ? column.lookupDataMap.get(colValueRaw) : colValueRaw

    return colValueMapped
  }

  getRowValue(row: T, column: TableColumnComponent) {
    const colValueStr = column.stringifyValue(this.getRowValueRaw(row, column), row)

    return colValueStr
  }

  onPageChange(newPage: number) {
    for (const [key, row] of Object.entries(this.rowMetaData)) {
      row.expanded = false
    }

    this.page = newPage
    this.updateVisibleData()
  }

  onRowClick(row: T, rowIndex: number, event: MouseEvent) {
    if (!this.trackBy || !this.selectionChange.observers.length) {
      return
    }

    const rowKey = this.trackRowBy(rowIndex, row)
    const rowMetaData = this.rowMetaData[rowKey]
    const prevSelection = this.selection

    let nextSelection = []

    if (rowMetaData.selected) {
      if (event.ctrlKey) {
        nextSelection = prevSelection.filter((r, i) => {
          return (this.trackRowBy(i, r) !== rowKey)
        })
      } else if (event.shiftKey) {
      } else {
        if (prevSelection.length === 1) {
          nextSelection = []
        } else {
          nextSelection = [row]
        }
      }
    } else {
      if (event.ctrlKey) {
        nextSelection = [...prevSelection, row]
      } else if (event.shiftKey) {
        if (prevSelection.length === 0) {
          nextSelection = [row]
        } else {
          const prevIndex = this.visibleData.indexOf(prevSelection[0])
          const nextIndex = this.visibleData.indexOf(row)
          const slice = (nextIndex > prevIndex) ? this.visibleData.slice(prevIndex, nextIndex + 1) : this.visibleData.slice(nextIndex, prevIndex + 1)

          nextSelection = slice
        }
      } else {
        nextSelection = [row]
      }
    }

    this.selectionChange.emit(nextSelection)
  }

  onResizeHandleMousedown(column: TableColumnComponent, mouseDownEvent: MouseEvent) {
    const { pageX } = mouseDownEvent
    const columnMetaData = this.columnMetaData[column.prop]
    const columnElement = (event.target as HTMLElement).parentElement
    const columnWidth = columnElement.offsetWidth
    const columnFlex = Number(column.flex)

    const mouseMoveEventHandler = (mouseMoveEvent: MouseEvent) => {
      const diffX = mouseMoveEvent.pageX - pageX

      if (column.flex) {
        columnMetaData.flex = columnFlex + Math.floor(diffX / 50)
      } else if (column.minWidth) {
        columnMetaData.minWidth = `${columnWidth + diffX}px`
      }

      this.changeDetectorRef.detectChanges()
    }

    const mouseUpEventHandler = (mouseUpEvent: MouseEvent) => {
      document.removeEventListener('mousemove', mouseMoveEventHandler)
      document.removeEventListener('mouseup', mouseUpEventHandler)

      if (this.tableMetaData.autosaveColumns) {
        this.saveColumnMetaData()
      }

      this.changeDetectorRef.detectChanges()
    }

    document.addEventListener('mousemove', mouseMoveEventHandler)
    document.addEventListener('mouseup', mouseUpEventHandler)
  }

  getColMeta(col: TableColumnComponent) {
    return this.columnMetaData[col.prop]
  }

  getRowMeta(row: T) {
    if (this.trackBy) {
      return this.rowMetaData[this.trackBy(row)]
    } else {
      return {}
    }
  }

  getColumnFilterValue(column: TableColumnComponent) {
    return (this.columnMetaData[column.prop].filter || {} as any).value || ''
  }

  loadTableMetaData() {
    Object.assign(this.tableMetaData, this.cacheData.tableMetaData)

    if (this.tableMetaData.autoloadColumns) {
      this.loadColumnMetaData()
    }

    this.updateVisibleData()
  }

  resetColumnMetaData() {
    for (const key of Object.keys(this.columnMetaData)) {
      delete this.columnMetaData[key]
    }

    if (this.tableMetaData.autosaveColumns) {
      this.saveColumnMetaData()
    }

    this.updateOrderedColumns()
    this.updateFilteredData()
  }

  saveColumnMetaData() {
    this.cacheData = Object.assign({}, this.cacheData, {
      columnMetaData: this.columnMetaData,
    })
  }

  loadColumnMetaData() {
    for (const [key, col] of Object.entries(this.cacheData.columnMetaData || {})) {
      this.columnMetaData[key] = col
    }

    this.updateOrderedColumns()
    this.updateFilteredData()
  }

  canRowExpand(row: T) {
    return this.getRowMeta(row).canExpand
  }

  get cacheData() {
    if (this.cacheId) {
      const str = localStorage.getItem(this.cacheId)

      return str ? JSON.parse(str) : {}
    } else {
      return {}
    }
  }

  set cacheData(value: any) {
    if (this.cacheId) {
      const str = JSON.stringify(
        Object.assign({}, value, {
          updatedAt: new Date(),
        })
      )

      localStorage.setItem(this.cacheId, str)
    }
  }

  get page() {
    return this.tableMetaData.page
  }

  set page(value) {
    this.tableMetaData.page = value
  }

  get tableClass() {
    return classNames({
      table: true,
      horizontal: this.horizontal,
      'table-striped': this.striped,
      'table-hover': this.hoverable,
      'table-scroll': this.scrollable,
      'force-desktop-mode': this.forceDesktopMode,
      'unselectable': this.unselectable,
    }, this.class)
  }
}
