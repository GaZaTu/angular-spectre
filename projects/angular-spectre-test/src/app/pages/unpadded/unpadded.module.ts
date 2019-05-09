import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UnpaddedComponent } from './unpadded.component';
import { UnpaddedFrameModule } from './unpadded-frame/unpadded-frame.module';
import { AppLibModule } from '../../app-lib.module';

const routes: Routes = [
  {
    path: '',
    component: UnpaddedComponent,
  },
]

@NgModule({
  declarations: [
    UnpaddedComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    UnpaddedFrameModule,
    AppLibModule,
  ],
})
export class UnpaddedModule { }
