import { Component, ViewChild } from '@angular/core';
import { TablemanagerComponent } from 'angular-spectre';
import { TablemanagerTestService, TablemanagerTest } from './tablemanager-test.service';

@Component({
  selector: 'app-tablemanager-test',
  templateUrl: './tablemanager-test.component.html',
  providers: [TablemanagerTestService],
})
export class TablemanagerTestComponent {
  @ViewChild(TablemanagerComponent)
  tableManager: TablemanagerComponent<TablemanagerTest>

  constructor(
    public service: TablemanagerTestService,
  ) { }

  get form() {
    return this.tableManager ? this.tableManager.service.formGroup : undefined
  }
}
