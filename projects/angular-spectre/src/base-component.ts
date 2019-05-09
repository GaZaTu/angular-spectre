import { OnInit, OnDestroy, AfterViewInit, AfterContentInit, OnChanges, ChangeDetectorRef } from '@angular/core';
import { Subscribable, Unsubscribable, Subject } from 'rxjs';

export class BaseComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentInit, OnChanges {
  private _unsubscribables = [] as Unsubscribable[]
  private _changes = new Subject<Partial<this>>()

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this._changeDetectorRef.detach()
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    for (const unsubscribable of this._unsubscribables) {
      unsubscribable.unsubscribe()
    }
  }

  ngAfterViewInit() {
    this.setState({})
  }

  ngAfterContentInit() {
    this.setState({})
  }

  ngOnChanges() {
    this.setState({})
  }

  setState(newState: Partial<this>) {
    Object.assign(this, newState)
    this._changes.next(newState)
    this._changeDetectorRef.detectChanges()
  }

  subscribeTo<T>(subscribable: Subscribable<T>) {
    return ((next, error, complete) => {
      if (typeof next !== 'object') {
        next = { next, error, complete }
      }

      const originalNext = next.next
      const originalError = next.error
      const originalComplete = next.complete

      next.next = value => {
        if (originalNext) {
          originalNext(value)
        }

        this.setState({})
      }

      next.error = error => {
        if (originalError) {
          originalError(error)
        }

        this.setState({})
      }

      next.complete = () => {
        if (originalComplete) {
          originalComplete()
        }

        this.setState({})
      }

      const unsubscribable = subscribable.subscribe(next)

      this._unsubscribables.push(unsubscribable)

      return unsubscribable
    }) as typeof subscribable.subscribe
  }

  get changes() {
    return this._changes.asObservable()
  }
}
