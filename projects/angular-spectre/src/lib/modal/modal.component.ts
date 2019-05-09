import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { ModalService } from './modal.service';
import { Subscribe } from '../../utils';

// @dynamic
@Component({
  selector: 'spectre-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  detachCdr = false

  @ViewChild('confirmationModalTemplate')
  confirmationModalTemplate: TemplateRef<any>

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public service: ModalService,
  ) { }

  ngOnInit() {
    if (this.detachCdr) {
      this.changeDetectorRef.detach()
    }
  }

  ngOnDestroy() { }

  ngAfterViewInit() {
    this.service.confirmationModalTemplate = this.confirmationModalTemplate
  }

  @Subscribe((self: ModalComponent) => self.service.modals)
  onModalsChange() {
    this.changeDetectorRef.detectChanges()
  }
}
