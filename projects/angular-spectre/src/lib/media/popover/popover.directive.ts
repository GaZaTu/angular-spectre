import { Directive, AfterViewInit, OnChanges, Input, TemplateRef, ElementRef, ViewContainerRef, EmbeddedViewRef } from '@angular/core';

@Directive({
  selector: '[spectrePopover]',
})
export class PopoverDirective implements AfterViewInit, OnChanges {
  @Input('spectrePopover')
  template: TemplateRef<any>
  @Input()
  popoverClass?: string
  @Input()
  popoverPosition?: 'top' | 'bottom' | 'left' | 'right'
  @Input()
  popoverContext?: any

  popoverContainer: HTMLElement
  constructedTemplate: EmbeddedViewRef<any>

  constructor(
    public ref: ElementRef<HTMLElement>,
    public vcr: ViewContainerRef,
  ) { }

  ngAfterViewInit() {
    this.createPopoverContainer()

    setTimeout(() => {
      this.populatePopoverContainer()
    })
  }

  ngOnChanges() {
    // this.updatePopoverContainer()
  }

  createPopoverContainer() {
    const el = this.ref.nativeElement
    const wrapper = document.createElement('div')
    this.popoverContainer = document.createElement('div')
    // const displayStyle = getComputedStyle(el).display

    el.parentNode.insertBefore(wrapper, el)
    wrapper.appendChild(el)
    wrapper.appendChild(this.popoverContainer)

    // tslint:disable-next-line:max-line-length
    wrapper.classList.add('popover', `popover-${this.popoverPosition}`, 'd-block', ...(this.popoverClass ? this.popoverClass.split(' ') : []))
    // wrapper.style.display = displayStyle
    this.popoverContainer.classList.add('popover-container')
  }

  populatePopoverContainer() {
    this.constructedTemplate = this.vcr.createEmbeddedView(this.template, {
      $implicit: this.popoverContext,
    })

    for (const node of this.constructedTemplate.rootNodes) {
      this.popoverContainer.appendChild(node)
    }
  }

  cleanupPopoverContainer() {
    if (this.popoverContainer) {
      while (this.popoverContainer.firstChild) {
        this.popoverContainer.removeChild(this.popoverContainer.firstChild)
      }
    }

    if (this.constructedTemplate) {
      this.constructedTemplate.destroy()
    }
  }

  updatePopoverContainer() {
    this.cleanupPopoverContainer()
    this.populatePopoverContainer()
  }
}
