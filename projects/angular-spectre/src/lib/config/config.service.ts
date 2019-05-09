import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  data = new BehaviorSubject({} as { [key: string]: any })

  get(key: string) {
    return this.data.value[key] || key.split('.').reduce((o, i) => o ? o[i] : undefined, this.data.value) || key
  }
}
