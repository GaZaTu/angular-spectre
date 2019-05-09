import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OnInit, OnDestroy, Type, forwardRef } from '@angular/core';
import { Observable, Subscription, fromEvent as observableFromEvent } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

export interface NgModel<T> extends ControlValueAccessor {
  writeValue(value: T): any
  registerOnChange(handler: (value: T) => void): any
  registerOnTouched(handler: () => void): any
  setDisabledState(isDisabled: boolean): any
}

export function ngModelProvider<T>(Component: Type<T>) {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Component),
    multi: true,
  }
}

// tslint:disable-next-line:ban-types
export type ProtoOf<T> = Pick<T, keyof T> & { constructor: Function }

interface SubscribableComponent extends OnInit, OnDestroy { }

// tslint:disable-next-line:max-line-length
export function Subscribe<TSelf extends SubscribableComponent, TArg = any>(getObservable: (self: TSelf) => Observable<TArg> | null | undefined | void, options: { getOn?: string } = {}) {
  return <T extends TSelf, K extends keyof T, F extends T[K]>
    (proto: ProtoOf<T>, key: K, descriptor: TypedPropertyDescriptor<any>) => {
    const ngOnInit = proto[options.getOn || 'ngOnInit']
    const ngOnDestroy = proto.ngOnDestroy

    const data = {
      subscription: null as Subscription | null,
    }

    // tslint:disable-next-line:space-before-function-paren
    proto[options.getOn || 'ngOnInit'] = function (this: T, ...args: any[]) {
      ngOnInit.apply(this, args)

      const observable = getObservable(this)

      if (observable) {
        data.subscription = observable.subscribe(value => {
          descriptor.value.apply(this, [value])
        })
      }
    }

    // tslint:disable-next-line:space-before-function-paren
    proto.ngOnDestroy = function (this: T, ...args: any[]) {
      if (data.subscription) {
        data.subscription.unsubscribe()
      }

      ngOnDestroy.apply(this, args)
    }
  }
}

export function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function hotkey(code: string) {
  const parts = code.split('+')
  const ctrlKey = parts.includes('ctrl')
  const shiftKey = parts.includes('shift')
  const altKey = parts.includes('alt')

  return observableFromEvent<KeyboardEvent>(window, 'keydown')
    .pipe(
      filter(ev => parts.includes(ev.key) && (ctrlKey === ev.ctrlKey) && (shiftKey === ev.shiftKey) && (altKey === ev.altKey)),
      tap(ev => ev.preventDefault())
    )
}
