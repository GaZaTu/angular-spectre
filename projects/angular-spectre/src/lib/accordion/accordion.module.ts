import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionComponent } from './accordion.component';
import { AccordionGroupComponent } from './accordion-group/accordion-group.component';
// container directives
import { AccordionHeaderDirective, AccordionBodyDirective } from './accordion.directives';

@NgModule({
  declarations: [
    AccordionComponent,
    AccordionGroupComponent,
    // container directives
    AccordionHeaderDirective,
    AccordionBodyDirective,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    AccordionComponent,
    AccordionGroupComponent,
    // container directives
    AccordionHeaderDirective,
    AccordionBodyDirective,
  ],
})
export class AccordionModule { }
