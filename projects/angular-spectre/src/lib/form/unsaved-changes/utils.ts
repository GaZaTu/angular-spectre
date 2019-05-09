import { OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';

export interface ComponentWithForm extends OnInit, OnDestroy {
  form?: FormGroup
}

export function UnsavedChangesGuardDecorator() {
  return <T extends ComponentWithForm, C extends (new (...args: any[]) => T)>(target: C) => {
    const proto = target.prototype as ComponentWithForm
    const ngOnInit = proto.ngOnInit
    const ngOnDestroy = proto.ngOnDestroy

    const data = {
      listener: null as EventListenerOrEventListenerObject
    }

    // tslint:disable-next-line:space-before-function-paren
    proto.ngOnInit = function (this: T, ...args: any[]) {
      if (ngOnInit) {
        ngOnInit.apply(this, args)
      }

      data.listener = (event: BeforeUnloadEvent) => {
        if (this.form && this.form.dirty) {
          event.returnValue = true
        }
      }

      window.addEventListener('beforeunload', data.listener)
    }

    // tslint:disable-next-line:space-before-function-paren
    proto.ngOnDestroy = function (this: T, ...args: any[]) {
      if (ngOnDestroy) {
        ngOnDestroy.apply(this, args)
      }

      window.removeEventListener('beforeunload', data.listener)
    }
  }
}
