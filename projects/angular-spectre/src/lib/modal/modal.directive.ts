import { Directive, AfterViewInit, OnDestroy, Input, TemplateRef, ElementRef } from '@angular/core';
import { ModalService } from './modal.service';

@Directive({
  selector: '[spectreModal]',
})
export class ModalDirective implements AfterViewInit, OnDestroy {
  @Input('spectreModal')
  template?: TemplateRef<any>
  @Input()
  modalContext?: any
  @Input()
  modalSize?: 'sm' | 'md' | 'lg'
  @Input()
  modalEvent = 'click'

  onClick = () => {
    this.serivce.open({
      template: this.template,
      context: this.modalContext,
      size: this.modalSize,
    })
  }

  constructor(
    public ref: ElementRef<HTMLElement>,
    public serivce: ModalService,
  ) { }

  ngAfterViewInit() {
    this.ref.nativeElement.addEventListener(this.modalEvent, this.onClick)
  }

  ngOnDestroy() {
    this.ref.nativeElement.removeEventListener(this.modalEvent, this.onClick)
  }
}
