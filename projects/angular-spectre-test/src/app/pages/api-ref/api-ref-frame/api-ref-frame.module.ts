import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiRefFrameComponent } from './api-ref-frame.component';
import { AppLibModule } from '../../../app-lib.module';
import { OpenapiRefModule } from 'angular-spectre';

@NgModule({
  declarations: [
    ApiRefFrameComponent,
  ],
  imports: [
    CommonModule,
    AppLibModule,
    OpenapiRefModule,
  ],
  exports: [
    ApiRefFrameComponent,
  ],
})
export class ApiRefFrameModule { }
