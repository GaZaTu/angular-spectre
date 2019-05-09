import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Modal {
  size?: 'sm' | 'md' | 'lg'
  closable?: boolean
  template?: TemplateRef<any>
  context?: any
  onClose?: () => any
  close?: () => any
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  modals = new BehaviorSubject<Set<Modal>>(new Set())
  confirmationModalTemplate: TemplateRef<any>

  open(modal: Modal) {
    modal.closable = (modal.closable === undefined) ? true : modal.closable
    modal.close = () => this.close(modal)

    this.modals.value.add(modal)
    this.modals.next(this.modals.value)

    return {
      close: () => this.close(modal),
      done: new Promise(resolve => modal.onClose = resolve),
    }
  }

  close(modal: Modal) {
    if (modal.onClose) {
      modal.onClose()
    }

    this.modals.value.delete(modal)
    this.modals.next(this.modals.value)
  }

  confirm(text: string) {
    return new Promise<boolean>(resolve => {
      this.open({
        size: 'sm',
        closable: false,
        template: this.confirmationModalTemplate,
        context: {
          text,
          resolve: () => resolve(true),
          reject: () => resolve(false),
        },
      })
    })
  }
}
