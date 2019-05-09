import { Component, OnInit, OnDestroy, AfterViewInit, OnChanges, ChangeDetectorRef, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { TablemanagerTest } from '../../tablemanager-test.service';

@Component({
  selector: 'app-tablemanager-test-list-frame',
  templateUrl: './tablemanager-test-list-frame.component.html',
  styleUrls: ['./tablemanager-test-list-frame.component.scss'],
})
export class TablemanagerTestListFrameComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input()
  rows: TablemanagerTest[]
  @Input()
  selectedRows: TablemanagerTest[]
  @Input()
  tableContextMenu?: TemplateRef<any>
  @Input()
  loading?: boolean

  @Output()
  selectedRowsChange = new EventEmitter<TablemanagerTest[]>()

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
  ) {
    this.changeDetectorRef.detach()
  }

  ngOnInit() { }

  ngOnDestroy() { }

  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges()
  }

  ngOnChanges() {
    this.changeDetectorRef.detectChanges()
  }

  get selection() {
    return this.selectedRows
  }

  set selection(value) {
    this.selectedRowsChange.emit(value)
  }
}
