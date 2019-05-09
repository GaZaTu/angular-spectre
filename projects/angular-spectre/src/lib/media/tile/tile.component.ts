// tslint:disable-next-line:max-line-length
import { Component, OnChanges, AfterContentInit, Input, HostBinding, TemplateRef, ViewEncapsulation, ChangeDetectorRef, OnDestroy, ContentChild } from '@angular/core';
import classNames from 'classnames';
// tslint:disable-next-line:max-line-length
import { TileIconDirective, TileIconBoxDirective, TileTitleDirective, TileSubtitleDirective, TileContentDirective, TileActionDirective } from './tile.directives';

@Component({
  selector: 'spectre-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TileComponent implements OnChanges, AfterContentInit, OnDestroy {
  @Input()
  centered?: boolean
  @Input()
  image?: string

  @Input()
  class?: any
  @HostBinding('class')
  get hostClass() {
    return classNames({
      [`tile`]: true,
      [`tile-centered`]: this.centered,
    }, this.class)
  }

  @ContentChild(TileIconDirective, { read: TemplateRef })
  tileIcon?: TemplateRef<any>
  @ContentChild(TileIconBoxDirective, { read: TemplateRef })
  iconBox?: TemplateRef<any>
  @ContentChild(TileTitleDirective, { read: TemplateRef })
  title?: TemplateRef<any>
  @ContentChild(TileSubtitleDirective, { read: TemplateRef })
  subtitle?: TemplateRef<any>
  @ContentChild(TileContentDirective, { read: TemplateRef })
  content?: TemplateRef<any>
  @ContentChild(TileActionDirective, { read: TemplateRef })
  action?: TemplateRef<any>

  @HostBinding('title')
  get hostTitle() {
    return ''
  }

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
