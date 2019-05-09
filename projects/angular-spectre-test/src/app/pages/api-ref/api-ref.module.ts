import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ApiRefComponent } from './api-ref.component';
import { ApiRefFrameModule } from './api-ref-frame/api-ref-frame.module';
import { AppLibModule } from '../../app-lib.module';

const routes: Routes = [
  {
    path: '',
    component: ApiRefComponent,
  },
]

@NgModule({
  declarations: [
    ApiRefComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ApiRefFrameModule,
    AppLibModule,
  ],
})
export class ApiRefModule { }
