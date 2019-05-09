import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ToastService, Toast } from './toast.service';
import { Subscribe } from '../../utils';

// @dynamic
@Component({
  selector: 'spectre-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts = [] as Toast[]

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public service: ToastService,
  ) {
    // this.changeDetectorRef.detach()
  }

  ngOnInit() { }

  ngOnDestroy() { }

  @Subscribe((self: ToastComponent) => self.service.toasts)
  onToastsChange(toasts: Toast[]) {
    this.toasts = toasts.filter(t => !t.closed)
    this.changeDetectorRef.detectChanges()
  }
}
