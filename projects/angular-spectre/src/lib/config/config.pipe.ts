import { Pipe, PipeTransform } from '@angular/core';
import { ConfigService } from './config.service';

@Pipe({
  name: 'config',
})
export class ConfigPipe implements PipeTransform {
  constructor(
    private _service: ConfigService,
  ) { }

  transform(key: any) {
    return this._service.get(key)
  }
}
