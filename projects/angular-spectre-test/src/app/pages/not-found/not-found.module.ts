import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found.component';
import { NotFoundFrameModule } from './not-found-frame/not-found-frame.module';

const routes: Routes = [
  {
    path: '',
    component: NotFoundComponent,
  },
]

@NgModule({
  declarations: [
    NotFoundComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NotFoundFrameModule,
  ],
})
export class NotFoundModule { }
