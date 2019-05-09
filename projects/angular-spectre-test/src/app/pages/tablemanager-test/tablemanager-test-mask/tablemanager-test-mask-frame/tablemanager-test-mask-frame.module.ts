import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablemanagerTestMaskFrameComponent } from './tablemanager-test-mask-frame.component';
import { FormModule } from 'angular-spectre';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TablemanagerTestMaskFrameComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormModule,
  ],
  exports: [
    TablemanagerTestMaskFrameComponent,
  ],
})
export class TablemanagerTestMaskFrameModule { }
