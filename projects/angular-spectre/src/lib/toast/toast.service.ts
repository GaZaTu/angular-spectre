import { Injectable, TemplateRef } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Toast {
  id?: string
  kind?: 'primary' | 'success' | 'warning' | 'error'
  closable?: boolean
  timeout?: number
  text?: string
  template?: TemplateRef<any>
  context?: any
  closed?: boolean
  longLived?: boolean
  onClose?: () => any
}

export interface TryOptions {
  stringifyError?: (error: any) => string
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts = new BehaviorSubject<Toast[]>([])

  add(toast: Toast) {
    toast.id = toast.id || Math.random().toString(36).substr(2, 10)
    toast.closable = (toast.closable === undefined) ? false : toast.closable

    this.toasts.next([toast, ...this.toasts.value])

    if (toast.timeout || !toast.closable) {
      setTimeout(() => this.remove(toast, { permanently: !toast.longLived }), toast.timeout || 10000)
    }

    return {
      close: (cOpts = { permanently: !toast.longLived }) => this.remove(toast, { permanently: cOpts.permanently }),
      done: new Promise(resolve => toast.onClose = resolve),
    }
  }

  remove(toast: Toast, opts = { permanently: !toast.longLived }) {
    if (toast.onClose) {
      toast.onClose()
      toast.onClose = undefined
      toast.closed = true
    }

    if (opts.permanently) {
      this.toasts.next(this.toasts.value.filter(t => t !== toast))
    } else {
      this.toasts.next(this.toasts.value)
    }
  }

  reactivateToasts(toasts = this.toasts.value, opts: { timeout?: number } = {}) {
    for (const toast of toasts) {
      toast.closed = false

      if (opts.timeout || toast.timeout || !toast.closable) {
        setTimeout(() => this.remove(toast, { permanently: !toast.longLived }), opts.timeout || toast.timeout || 10000)
      }
    }

    this.toasts.next(this.toasts.value)
  }

  private addWithKind(toast: Toast | string, kind: Toast['kind']) {
    if (typeof toast === 'string') {
      toast = { text: toast }
    }

    return this.add(Object.assign(toast, { kind }))
  }

  info(toast: Toast | string) {
    return this.addWithKind(toast, undefined)
  }

  primary(toast: Toast | string) {
    return this.addWithKind(toast, 'primary')
  }

  success(toast: Toast | string) {
    return this.addWithKind(toast, 'success')
  }

  warning(toast: Toast | string) {
    return this.addWithKind(toast, 'warning')
  }

  error(toast: Toast | string) {
    return this.addWithKind(toast, 'error')
  }

  throw(error: any) {
    this.error(`${error}`)
    throw error
  }

  try<R>(fn: () => R, options?: TryOptions): R
  try<R>(fn: () => Promise<R>, options?: TryOptions): Promise<R>
  try<R>(fn: () => Observable<R>, options?: TryOptions): Observable<R>
  try(fn: () => any, options = { stringifyError: error => `${error}` }): any {
    try {
      const result = fn()

      if (result instanceof Promise) {
        return result.catch(error => this.throw(options.stringifyError(error)))
      } else if (result instanceof Observable) {
        return result.pipe(tap({ error: error => this.error(options.stringifyError(error)) }))
      } else {
        return result
      }
    } catch (error) {
      this.throw(options.stringifyError(error))
    }
  }
}
