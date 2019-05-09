import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablemanagerTestListFrameComponent } from './tablemanager-test-list-frame.component';
import { TableModule, MediaModule } from 'angular-spectre';

@NgModule({
  declarations: [
    TablemanagerTestListFrameComponent,
  ],
  imports: [
    CommonModule,
    TableModule,
    MediaModule,
  ],
  exports: [
    TablemanagerTestListFrameComponent,
  ],
})
export class TablemanagerTestListFrameModule { }
