import { Component, OnInit, OnDestroy } from '@angular/core';
import { OffcanvasService, TablemanagerService, Subscribe } from 'angular-spectre';
import { UnpaddedContent } from '../../../utils/unpadded-content';
import { TablemanagerTest } from '../tablemanager-test.service';
import { ActivatedRoute } from '@angular/router';

@UnpaddedContent()
@Component({
  selector: 'app-tablemanager-test-list',
  templateUrl: './tablemanager-test-list.component.html',
})
export class TablemanagerTestListComponent implements OnInit, OnDestroy {
  constructor(
    public route: ActivatedRoute,
    public tableManagerService: TablemanagerService<TablemanagerTest>,
    public offcanvasService: OffcanvasService,
  ) { }

  ngOnInit() { }

  ngOnDestroy() { }

  @Subscribe((self: TablemanagerTestListComponent) => self.route.queryParams)
  onQueryParamsChange() {
    this.tableManagerService.onMask = false
    this.tableManagerService.refresh()
  }

  get rows() {
    return this.tableManagerService.rows
  }

  get selectedRows() {
    return this.tableManagerService.selectedRows
  }

  set selectedRows(value) {
    this.tableManagerService.selectedRows = value
  }

  get tableContextMenu() {
    return this.tableManagerService.tableContextMenu
  }
}
