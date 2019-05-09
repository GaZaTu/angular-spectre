// tslint:disable-next-line:max-line-length
import { Component, OnChanges, AfterContentInit, Input, HostBinding, TemplateRef, ChangeDetectorRef, OnDestroy, ContentChild } from '@angular/core';
import classNames from 'classnames';
import { CardTitleDirective, CardSubtitleDirective, CardBodyDirective, CardFooterDirective } from './card.directives';

@Component({
  selector: 'spectre-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnChanges, AfterContentInit, OnDestroy {
  @Input()
  image?: string
  @Input()
  imagePos?: number
  @Input()
  withoutPadding?: boolean

  @Input()
  class?: any
  @HostBinding('class')
  get hostClass() {
    return classNames({
      [`card`]: true,
    }, this.class)
  }

  @ContentChild(CardTitleDirective, { read: TemplateRef })
  title?: TemplateRef<any>
  @ContentChild(CardSubtitleDirective, { read: TemplateRef })
  subtitle?: TemplateRef<any>
  @ContentChild(CardBodyDirective, { read: TemplateRef })
  body?: TemplateRef<any>
  @ContentChild(CardFooterDirective, { read: TemplateRef })
  footer?: TemplateRef<any>

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
  ) {
    this.changeDetectorRef.detach()
  }

  ngOnDestroy() { }

  ngOnChanges() {
    this.changeDetectorRef.detectChanges()
  }

  ngAfterContentInit() {
    this.changeDetectorRef.detectChanges()
  }
}
