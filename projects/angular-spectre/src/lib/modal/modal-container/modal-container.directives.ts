import { Directive } from '@angular/core';

@Directive({
  selector: '[spectreModalContainerTitle]',
})
export class ModalContainerTitleDirective { }

@Directive({
  selector: '[spectreModalContainerBody]',
})
export class ModalContainerBodyDirective { }

@Directive({
  selector: '[spectreModalContainerFooter]',
})
export class ModalContainerFooterDirective { }
