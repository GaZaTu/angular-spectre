import { Directive, AfterViewInit, OnDestroy, Input, TemplateRef, ElementRef } from '@angular/core';
import { ContextMenuService } from './context-menu.service';

@Directive({
  selector: '[spectreContextMenu]',
})
export class ContextMenuDirective implements AfterViewInit, OnDestroy {
  @Input('spectreContextMenu')
  templateOrLinks?: TemplateRef<any> | { text: string, href: string }[]
  @Input()
  contextMenuContext?: any
  @Input()
  contextMenuEvent = 'contextmenu'
  @Input()
  contextMenuAnchor: 'mouse' | 'target' = 'mouse'
  @Input()
  contextMenuHidePrevious?: boolean

  onContextMenu = (event: MouseEvent) => {
    this.serivce.show({
      template: !Array.isArray(this.templateOrLinks) && this.templateOrLinks,
      links: Array.isArray(this.templateOrLinks) && this.templateOrLinks,
      context: this.contextMenuContext,
      anchor: this.contextMenuAnchor,
      hidePrevious: this.contextMenuHidePrevious,
      pos: event,
    })
  }

  constructor(
    public ref: ElementRef<HTMLElement>,
    public serivce: ContextMenuService,
  ) { }

  ngAfterViewInit() {
    this.ref.nativeElement.addEventListener(this.contextMenuEvent, this.onContextMenu)
  }

  ngOnDestroy() {
    this.ref.nativeElement.removeEventListener(this.contextMenuEvent, this.onContextMenu)
  }
}
