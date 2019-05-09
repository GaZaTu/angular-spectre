import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class FormGroupService {
  // parent
  id = Math.random().toString(36).substr(2, 10)
  size = new BehaviorSubject<'sm' | 'md' | 'lg'>('md')
  label = new BehaviorSubject<string>('...')

  // child
  formControlName = new BehaviorSubject<string | undefined>(undefined)
}
