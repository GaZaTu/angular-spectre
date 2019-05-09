import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormService } from './form.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'spectre-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  providers: [FormService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent {
  @Input()
  set size(value: 'sm' | 'md' | 'lg') {
    this.service.size.next(value)
  }
  @Input()
  set horizontal(value: boolean) {
    this.service.horizontal.next(value)
  }
  @Input()
  set formGroup(value: FormGroup) {
    this.service.formGroup.next(value)
  }

  @Output()
  submit = new EventEmitter<Event>()

  constructor(
    public service: FormService,
  ) { }

  onSubmit(event: Event) {
    event.preventDefault()
    event.stopPropagation()

    this.submit.emit(event)
  }

  get formClass() {
    return {
      'form-horizontal': this.service.horizontal.value,
    }
  }
}
