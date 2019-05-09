import { Directive, AfterViewInit, OnChanges, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[spectreBadge]',
})
export class BadgeDirective implements AfterViewInit, OnChanges {
  @Input('spectreBadge')
  badge?: string

  constructor(
    public ref: ElementRef<HTMLElement>,
  ) { }

  ngAfterViewInit() {
    this.updateBadgeOnEl()
  }

  ngOnChanges() {
    this.updateBadgeOnEl()
  }

  updateBadgeOnEl() {
    if (this.badge === undefined) {
      this.ref.nativeElement.classList.remove('badge')
      this.ref.nativeElement.dataset.badge = ''
    } else {
      this.ref.nativeElement.classList.add('badge')
      this.ref.nativeElement.dataset.badge = this.badge
    }
  }
}
