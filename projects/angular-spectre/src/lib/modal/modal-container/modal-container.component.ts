import { Component, Input, HostBinding, ContentChild, TemplateRef, OnChanges, AfterContentInit, ChangeDetectorRef } from '@angular/core';
import classNames from 'classnames';
import { ModalService, Modal } from '../modal.service';
import { ModalContainerTitleDirective, ModalContainerBodyDirective, ModalContainerFooterDirective } from './modal-container.directives';

@Component({
  selector: 'spectre-modal-container',
  templateUrl: './modal-container.component.html',
  styleUrls: ['./modal-container.component.scss'],
})
export class ModalContainerComponent implements OnChanges, AfterContentInit {
  @Input()
  modal: Modal
  @Input()
  wide?: boolean

  @Input()
  class?: any
  @HostBinding('class')
  get hostClass() {
    return classNames({
      'modal-container': true,
      'wide': this.wide,
    }, this.class)
  }

  @ContentChild(ModalContainerTitleDirective, { read: TemplateRef })
  title?: TemplateRef<any>
  @ContentChild(ModalContainerBodyDirective, { read: TemplateRef })
  body?: TemplateRef<any>
  @ContentChild(ModalContainerFooterDirective, { read: TemplateRef })
  footer?: TemplateRef<any>

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public service: ModalService,
  ) {
    this.changeDetectorRef.detach()
  }

  ngOnChanges() {
    this.changeDetectorRef.detectChanges()
  }

  ngAfterContentInit() {
    this.changeDetectorRef.detectChanges()
  }
}
