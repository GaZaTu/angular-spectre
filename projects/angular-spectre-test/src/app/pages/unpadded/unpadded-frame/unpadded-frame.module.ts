import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnpaddedFrameComponent } from './unpadded-frame.component';
import { RouterModule } from '@angular/router';
import { MediaModule, TableModule, ButtonModule } from 'angular-spectre';
import { AppLibModule } from '../../../app-lib.module';

@NgModule({
  declarations: [
    UnpaddedFrameComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MediaModule,
    TableModule,
    ButtonModule,
    AppLibModule,
  ],
  exports: [
    UnpaddedFrameComponent,
  ],
})
export class UnpaddedFrameModule { }
