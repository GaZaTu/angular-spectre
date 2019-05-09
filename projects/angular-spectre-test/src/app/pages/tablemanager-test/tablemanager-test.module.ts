import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TablemanagerModule, UnsavedChangesGuard } from 'angular-spectre';
import { TablemanagerTestComponent } from './tablemanager-test.component';
import { TablemanagerTestListComponent } from './tablemanager-test-list/tablemanager-test-list.component';
import { TablemanagerTestMaskComponent } from './tablemanager-test-mask/tablemanager-test-mask.component';
import { TablemanagerTestListFrameModule } from './tablemanager-test-list/tablemanager-test-list-frame/tablemanager-test-list-frame.module';
import { TablemanagerTestMaskFrameModule } from './tablemanager-test-mask/tablemanager-test-mask-frame/tablemanager-test-mask-frame.module';

const routes: Routes = [
  {
    path: '',
    component: TablemanagerTestComponent,
    canDeactivate: [UnsavedChangesGuard],
    children: [
      {
        path: '',
        component: TablemanagerTestListComponent,
      },
      {
        path: ':id',
        component: TablemanagerTestMaskComponent,
      },
    ],
  },
]

@NgModule({
  declarations: [
    TablemanagerTestComponent,
    TablemanagerTestListComponent,
    TablemanagerTestMaskComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TablemanagerModule,
    TablemanagerTestListFrameModule,
    TablemanagerTestMaskFrameModule,
  ],
})
export class TablemanagerTestModule { }
