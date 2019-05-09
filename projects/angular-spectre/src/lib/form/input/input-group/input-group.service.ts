import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class InputGroupService {
  size = new BehaviorSubject<'sm' | 'md' | 'lg'>('md')
}
