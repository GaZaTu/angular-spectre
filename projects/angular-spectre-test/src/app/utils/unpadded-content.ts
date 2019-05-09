import { OnInit, OnDestroy } from '@angular/core';
import { OffcanvasService } from 'angular-spectre';

interface Type<T> extends Function {
  prototype: T

  new(...args: any[]): T
}

export interface UnpaddedContentIntf extends OnInit, OnDestroy {
  offcanvasService: OffcanvasService
}

export function UnpaddedContent() {
  return (target: Type<UnpaddedContentIntf>) => {
    const proto = target.prototype
    const ngOnInit = proto.ngOnInit
    const ngOnDestroy = proto.ngOnDestroy

    // tslint:disable-next-line:space-before-function-paren
    proto.ngOnInit = function (this: UnpaddedContentIntf) {
      this.offcanvasService.contentPadding.next(true)
      ngOnInit.apply(this)
    }

    // tslint:disable-next-line:space-before-function-paren
    proto.ngOnDestroy = function (this: UnpaddedContentIntf) {
      this.offcanvasService.contentPadding.next(false)
      ngOnDestroy.apply(this)
    }
  }
}
