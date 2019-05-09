import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscribe, TablemanagerService } from 'angular-spectre';
import { TablemanagerTest } from '../tablemanager-test.service';

@Component({
  selector: 'app-tablemanager-test-mask',
  templateUrl: './tablemanager-test-mask.component.html',
})
export class TablemanagerTestMaskComponent implements OnInit, OnDestroy {
  constructor(
    public route: ActivatedRoute,
    public tableManagerService: TablemanagerService<TablemanagerTest>,
  ) { }

  ngOnInit() { }

  ngOnDestroy() { }

  @Subscribe((self: TablemanagerTestMaskComponent) => self.route.params)
  onParamsChange({ id }) {
    this.tableManagerService.id = id
    this.tableManagerService.onMask = true
    this.tableManagerService.refresh({ full: true })
  }

  get form() {
    return this.tableManagerService.formGroup
  }

  set form(value) {
    this.tableManagerService.formGroup = value
  }
}
