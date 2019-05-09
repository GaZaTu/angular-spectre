import { Component, OnChanges, AfterContentInit, ChangeDetectorRef, Input } from '@angular/core';

@Component({
  selector: 'spectre-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss'],
})
export class CodeComponent implements OnChanges, AfterContentInit {
  @Input()
  lang?: string

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
  ) {
    this.changeDetectorRef.detach()
  }

  ngOnChanges() {
    this.changeDetectorRef.detectChanges()
  }

  ngAfterContentInit() {
    this.changeDetectorRef.detectChanges()
  }
}
