import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import classNames from 'classnames';

@Component({
  selector: 'spectre-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageComponent {
  @Input()
  src?: string
  @Input()
  mode?: 'responsive' | 'fit-contain' | 'fit-cover'
  @Input()
  caption?: string
  @Input()
  captionAlignment?: 'left' | 'center' | 'right'

  @Input()
  class?: any
  @HostBinding('class')
  get hostClass() {
    return classNames({
      [`figure`]: true,
    }, this.class)
  }
}
