import { Component } from '@angular/core';
import { test } from './test';

@Component({
  selector: 'app-api-ref-frame',
  templateUrl: './api-ref-frame.component.html',
})
export class ApiRefFrameComponent {
  spec = test
}
