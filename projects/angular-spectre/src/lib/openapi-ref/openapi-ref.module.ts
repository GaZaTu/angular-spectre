import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OpenapiRefComponent } from './openapi-ref.component';
// container directives
import { OpenapiRefAuthIconDirective } from './openapi-ref.directives';
import { AccordionModule } from '../accordion';
import { MediaModule } from '../media';
import { TableModule } from '../table';
import { ConfigModule } from '../config';

@NgModule({
  declarations: [
    OpenapiRefComponent,
    // container directives
    OpenapiRefAuthIconDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
    AccordionModule,
    MediaModule,
    TableModule,
    ConfigModule,
  ],
  exports: [
    OpenapiRefComponent,
    // container directives
    OpenapiRefAuthIconDirective,
  ],
})
export class OpenapiRefModule { }
