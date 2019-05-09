import { Directive, OnInit, OnDestroy, AfterViewInit, Input, HostBinding, Output, EventEmitter, ElementRef, Optional } from '@angular/core';
import classNames from 'classnames';
import { InputGroupService } from '../../form/input/input-group/input-group.service';
import { Subscribe } from '../../../utils';

// @dynamic
@Directive({
  selector: '[spectreIcon]',
})
export class IconDirective implements OnInit, OnDestroy, AfterViewInit {
  @Input('spectreIcon')
  // tslint:disable-next-line:max-line-length
  icon: 'arrow-up' | 'arrow-right' | 'arrow-down' | 'arrow-left' | 'upward' | 'forward' | 'downward' | 'back' | 'caret' | 'menu' | 'apps' | 'more-horiz' | 'more-vert' | 'cross' | 'check' | 'stop' | 'shutdown' | 'refresh' | 'search' | 'flag' | 'bookmark' | 'edit' | 'delete' | 'share' | 'download' | 'upload' | 'copy' | 'mail' | 'people' | 'message' | 'photo' | 'time' | 'location' | 'link' | 'emoji'
  @Input()
  size?: '1x' | '2x' | '3x' | '4x'

  @Input()
  class?: any
  @HostBinding('class')
  get hostClass() {
    return classNames(
      this.iconClass,
      this.click.observers.length > 0 ? 'c-hand' : undefined,
      this.class,
    )
  }

  @Output()
  click = new EventEmitter<MouseEvent>()

  containerElement?: HTMLElement
  containerElementAddonSize?: string

  constructor(
    public ref: ElementRef<HTMLElement>,
    @Optional() public inputGroup?: InputGroupService,
  ) { }

  ngOnInit() { }

  ngOnDestroy() { }

  ngAfterViewInit() {
    if (this.isInputGroupChild) {
      this.containerElement = document.createElement('div')

      this.containerElement.classList.add('input-group-addon', 'input-group-icon')
      this.ref.nativeElement.parentElement.insertBefore(this.containerElement, this.ref.nativeElement)
      this.containerElement.appendChild(this.ref.nativeElement)
    }
  }

  @Subscribe((self: IconDirective) => self.isInputGroupChild && self.inputGroup.size)
  onInputGroupSizeChange(value: any) {
    if (this.containerElement) {
      this.setContainerElementAddonSize(value)
    } else {
      setTimeout(() => this.setContainerElementAddonSize(value))
    }
  }

  setContainerElementAddonSize(value: any) {
    this.containerElement.classList.remove(this.containerElementAddonSize)
    this.containerElementAddonSize = `addon-${value}`
    this.containerElement.classList.add(this.containerElementAddonSize)
  }

  get iconClass() {
    return {
      [`icon`]: true,
      [`icon-${this.icon}`]: this.icon,
      [`icon-${this.size}`]: this.size,
    }
  }

  get parentElement() {
    return this.containerElement ? this.containerElement.parentElement : this.ref.nativeElement.parentElement
  }

  get isInputGroupChild() {
    return this.parentElement.matches('spectre-input-group')
  }
}
