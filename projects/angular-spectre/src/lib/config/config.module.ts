import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigPipe } from './config.pipe';

@NgModule({
  declarations: [
    ConfigPipe,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ConfigPipe,
  ],
})
export class ConfigModule { }
