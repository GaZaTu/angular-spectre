import { Directive, AfterViewInit, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[spectreTooltip]',
})
export class TooltipDirective implements AfterViewInit {
  @Input('spectreTooltip')
  tooltip?: string

  constructor(
    public ref: ElementRef<HTMLElement>,
  ) { }

  ngAfterViewInit() {
    this.ref.nativeElement.classList.add('tooltip')
    this.ref.nativeElement.dataset.tooltip = this.tooltip
  }
}
