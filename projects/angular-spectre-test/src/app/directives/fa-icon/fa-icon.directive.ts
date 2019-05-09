import { Directive, OnInit, OnDestroy, AfterViewInit, Input, HostBinding, ElementRef, Optional } from '@angular/core';
import { IconDirective, InputGroupService } from 'angular-spectre';
import { FaIconService } from './fa-icon.service';

@Directive({
  selector: '[appFaIcon]',
})
export class FaIconDirective extends IconDirective implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  kind: 'fa' | 'fas' | 'far' | 'fal' = 'fa'
  @Input('appFaIcon')
  icon: any // string
  @Input()
  size?: any // 'xs' | 'sm' | 'md' | 'lg' | '2x'

  @HostBinding('style.vertical-align')
  get verticalAlign() {
    return this.isInputGroupChild ? 'middle' : undefined
  }

  constructor(
    public service: FaIconService,
    ref: ElementRef<HTMLElement>,
    @Optional() inputGroup?: InputGroupService,
  ) {
    super(ref, inputGroup)
  }

  ngOnInit() {
    super.ngOnInit()

    if (!this.service.loadedStylesheet) {
      this.service.loadedStylesheet = true

      const link = document.createElement('link')

      link.rel = 'stylesheet'
      link.type = 'text/css'
      link.media = 'screen'
      link.crossOrigin = 'anonymous'
      link.href = this.service.href
      link.integrity = this.service.integrity

      document.head.appendChild(link)
    }
  }

  get iconClass() {
    return {
      [`fa-icon`]: true,
      [this.kind]: this.kind,
      [`fa-${this.icon}`]: this.icon,
      [`fa-${this.size}`]: this.size,
    } as any
  }
}
