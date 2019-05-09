import { Component, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'spectre-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
})
export class OptionComponent<T = any> {
  @Input()
  value: T

  @ViewChild('contentWrapper')
  content: ElementRef

  key = Math.random().toString(36).substr(2, 10)

  get text() {
    if (this.content) {
      return (this.content.nativeElement as HTMLSpanElement).innerText
    } else {
      return ''
    }
  }
}
