import { OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { ProtoOf } from 'angular-spectre';

interface RouteWatchable extends OnInit, OnDestroy {
  route: ActivatedRoute
}

export function WatchRoute<TSelf extends RouteWatchable>() {
  return <T extends TSelf, K extends keyof T, F extends T[K]>
    (proto: ProtoOf<T>, key: K, descriptor: TypedPropertyDescriptor<F>) => {
    const method = descriptor.value as any
    const ngOnInit = proto.ngOnInit
    const ngOnDestroy = proto.ngOnDestroy

    const data = {
      prevStringifiedParams: '',
      prevStringifiedQueryParams: '',
      prevFragment: '',
      subscription: null as Subscription | null,
    }

    // tslint:disable-next-line:space-before-function-paren
    proto.ngOnInit = function (this: T, ...args: any[]) {
      if (ngOnInit) {
        ngOnInit.apply(this, args)
      }

      combineLatest(
        this.route.params,
        this.route.queryParams,
        this.route.fragment,
      ).subscribe(([params, queryParams, fragment]) => {
        const stringifiedParams = JSON.stringify(params)
        const stringifiedQueryParams = JSON.stringify(queryParams)

        if (stringifiedParams === data.prevStringifiedParams) {
          params = null
        } else {
          data.prevStringifiedParams = stringifiedParams
        }

        if (stringifiedQueryParams === data.prevStringifiedQueryParams) {
          queryParams = null
        } else {
          data.prevStringifiedQueryParams = stringifiedQueryParams
        }

        if (fragment === data.prevFragment) {
          fragment = null
        } else {
          data.prevFragment = fragment
        }

        if (params || queryParams) {
          method.apply(this, [params, queryParams, fragment])
        }
      })
    }

    // tslint:disable-next-line:space-before-function-paren
    proto.ngOnDestroy = function (this: T, ...args: any[]) {
      data.prevStringifiedParams = ''
      data.prevStringifiedQueryParams = ''
      data.prevFragment = ''
      data.subscription.unsubscribe()

      if (ngOnDestroy) {
        ngOnDestroy.apply(this, args)
      }
    }
  }
}
