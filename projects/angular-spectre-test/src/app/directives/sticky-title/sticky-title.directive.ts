import { Directive, AfterViewInit, Input, ElementRef, HostBinding } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[appStickyTitle]',
})
export class StickyTitleDirective implements AfterViewInit {
  @Input('appStickyTitle')
  kind?: 'title' | 'subtitle'
  @Input()
  id?: string

  constructor(
    public ref: ElementRef<HTMLElement>,
    public router: Router,
  ) { }

  ngAfterViewInit() {
    if (this.id) {
      const anchor = document.createElement('a')

      anchor.text = '#'
      anchor.href = `#${this.router.url}#${this.id}`
      anchor.classList.add('anchor', 'c-hand')

      this.ref.nativeElement.appendChild(anchor)
    }
  }

  @HostBinding('class.s-title')
  get isTitle() {
    return this.kind !== 'subtitle'
  }

  @HostBinding('class.s-subtitle')
  get isSubtitle() {
    return this.kind === 'subtitle'
  }
}
