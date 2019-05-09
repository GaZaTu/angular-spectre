import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Injectable()
export class FormService {
  size = new BehaviorSubject<'sm' | 'md' | 'lg'>('md')
  horizontal = new BehaviorSubject<boolean>(false)
  formGroup = new BehaviorSubject<FormGroup | undefined>(undefined)
}
