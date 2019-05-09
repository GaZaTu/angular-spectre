import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccordionGroupService {
  name = Math.random().toString(36).substr(2, 10)
  exclusive = new BehaviorSubject<boolean | undefined>(undefined)
  showIcon = new BehaviorSubject<boolean | undefined>(undefined)
  alwaysRender = new BehaviorSubject<boolean | undefined>(undefined)
}
