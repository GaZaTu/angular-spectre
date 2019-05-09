import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index.component';
import { IndexFrameModule } from './index-frame/index-frame.module';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
  },
]

@NgModule({
  declarations: [
    IndexComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    IndexFrameModule,
  ],
})
export class IndexModule { }
