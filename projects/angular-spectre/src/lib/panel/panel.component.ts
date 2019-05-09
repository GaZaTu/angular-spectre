// tslint:disable-next-line:max-line-length
import { Component, OnInit, OnDestroy, AfterContentInit, OnChanges, Input, HostBinding, TemplateRef, ChangeDetectorRef, ContentChild } from '@angular/core';
import classNames from 'classnames';
// tslint:disable-next-line:max-line-length
import { PanelHeaderDirective, PanelTitleDirective, PanelSubtitleDirective, PanelNavDirective, PanelBodyDirective, PanelFooterDirective } from './panel.directives';

@Component({
  selector: 'spectre-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnInit, OnDestroy, AfterContentInit, OnChanges {
  @Input()
  class?: any
  @HostBinding('class')
  get hostClass() {
    return classNames({
      [`panel`]: true,
    }, this.class)
  }

  @ContentChild(PanelHeaderDirective, { read: TemplateRef })
  header?: TemplateRef<any>
  @ContentChild(PanelTitleDirective, { read: TemplateRef })
  title?: TemplateRef<any>
  @ContentChild(PanelSubtitleDirective, { read: TemplateRef })
  subtitle?: TemplateRef<any>
  @ContentChild(PanelNavDirective, { read: TemplateRef })
  nav?: TemplateRef<any>
  @ContentChild(PanelBodyDirective, { read: TemplateRef })
  body?: TemplateRef<any>
  @ContentChild(PanelFooterDirective, { read: TemplateRef })
  footer?: TemplateRef<any>

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
  ) {
    this.changeDetectorRef.detach()
  }

  ngOnInit() { }

  ngOnDestroy() { }

  ngAfterContentInit() {
    this.changeDetectorRef.detectChanges()
  }

  ngOnChanges() {
    this.changeDetectorRef.detectChanges()
  }
}
