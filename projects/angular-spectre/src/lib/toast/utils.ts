import { ProtoOf } from '../../utils';
import { ToastService, TryOptions } from './toast.service';

interface TryOrToastComponent {
  toastService: ToastService
}

// tslint:disable-next-line:max-line-length
export function TryOrToast<TSelf extends TryOrToastComponent>(options?: TryOptions) {
  return <T extends TSelf, K extends keyof T, F extends T[K]>
    (proto: ProtoOf<T>, key: K, descriptor: TypedPropertyDescriptor<any>) => {
    const method = descriptor.value

    // tslint:disable-next-line:space-before-function-paren
    descriptor.value = function (this: T, ...args: any[]) {
      return this.toastService.try(() => method.apply(this, args), options)
    }
  }
}
