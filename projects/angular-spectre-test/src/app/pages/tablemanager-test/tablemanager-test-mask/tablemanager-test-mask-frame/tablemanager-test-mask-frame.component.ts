import { Component, OnInit, OnDestroy, AfterViewInit, OnChanges, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscribe } from 'angular-spectre';

@Component({
  selector: 'app-tablemanager-test-mask-frame',
  templateUrl: './tablemanager-test-mask-frame.component.html',
  styleUrls: ['./tablemanager-test-mask-frame.component.scss'],
})
export class TablemanagerTestMaskFrameComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Output()
  formChange = new EventEmitter<FormGroup>()

  form = this.fb.group({
    name: [''],
    company: [''],
    num: [0],
  })

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public fb: FormBuilder,
  ) {
    this.changeDetectorRef.detach()
  }

  ngOnInit() {
    this.formChange.emit(this.form)
  }

  ngOnDestroy() { }

  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges()
  }

  ngOnChanges() {
    this.changeDetectorRef.detectChanges()
  }

  @Subscribe((self: TablemanagerTestMaskFrameComponent) => self.form.valueChanges)
  onFormValueChange() {
    this.changeDetectorRef.detectChanges()
  }
}
