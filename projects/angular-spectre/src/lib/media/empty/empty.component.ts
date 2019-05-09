// tslint:disable-next-line:max-line-length
import { Component, OnChanges, AfterContentInit, Input, HostBinding, TemplateRef, ChangeDetectorRef, ContentChildren, QueryList, OnInit, OnDestroy, ContentChild } from '@angular/core';
import classNames from 'classnames';
import { EmptyIconDirective, EmptyTitleDirective, EmptySubtitleDirective } from './empty.directives';
import { Subscribe } from '../../../utils';

// @dynamic
@Component({
  selector: 'spectre-empty',
  templateUrl: './empty.component.html',
  styleUrls: ['./empty.component.scss'],
})
export class EmptyComponent implements OnChanges, AfterContentInit, OnInit, OnDestroy {
  @Input()
  class?: any
  @HostBinding('class')
  get hostClass() {
    return classNames({
      [`empty`]: true,
    }, this.class)
  }

  @ContentChild(EmptyIconDirective, { read: TemplateRef })
  icon?: TemplateRef<any>
  @ContentChild(EmptyTitleDirective, { read: TemplateRef })
  title?: TemplateRef<any>
  @ContentChild(EmptySubtitleDirective, { read: TemplateRef })
  subtitle?: TemplateRef<any>

  @ContentChildren('action')
  actions?: QueryList<TemplateRef<any>>

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
  ) {
    this.changeDetectorRef.detach()
  }

  ngOnInit() { }

  ngOnDestroy() { }

  ngOnChanges() {
    this.changeDetectorRef.detectChanges()
  }

  ngAfterContentInit() {
    this.changeDetectorRef.detectChanges()
  }

  @Subscribe((self: EmptyComponent) => self.actions.changes, { getOn: 'ngAfterContentInit' })
  onOptionsChange() {
    this.changeDetectorRef.detectChanges()
  }
}
