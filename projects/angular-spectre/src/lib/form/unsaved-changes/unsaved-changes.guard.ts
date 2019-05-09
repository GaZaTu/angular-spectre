import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { ConfigService } from '../../config';
import { ComponentWithForm } from './utils';

@Injectable({
  providedIn: 'root',
})
export class UnsavedChangesGuard implements CanDeactivate<ComponentWithForm> {
  constructor(
    public configService: ConfigService,
  ) {}

  canDeactivate(target: ComponentWithForm) {
    if (target.form && target.form.dirty) {
      return confirm(this.configService.get('unsavedChanges.message'))
    } else {
      return true
    }
  }
}
