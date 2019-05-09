import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal.component';
import { ModalContainerComponent } from './modal-container/modal-container.component';
import { ModalDirective } from './modal.directive';
// container directives
// tslint:disable-next-line:max-line-length
import { ModalContainerTitleDirective, ModalContainerBodyDirective, ModalContainerFooterDirective } from './modal-container/modal-container.directives';

@NgModule({
  declarations: [
    ModalComponent,
    ModalContainerComponent,
    ModalDirective,
    // container directives
    ModalContainerTitleDirective,
    ModalContainerBodyDirective,
    ModalContainerFooterDirective,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ModalComponent,
    ModalContainerComponent,
    ModalDirective,
    // container directives
    ModalContainerTitleDirective,
    ModalContainerBodyDirective,
    ModalContainerFooterDirective,
  ],
})
export class ModalModule { }
