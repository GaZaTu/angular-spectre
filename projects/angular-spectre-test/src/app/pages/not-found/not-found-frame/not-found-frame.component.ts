import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found-frame',
  template: `
    <div class="empty" style="background: unset">
      <p class="empty-title h5">404 - ¯\\_( ツ )_/¯</p>
      <p class="empty-subtitle">Page not found</p>
    </div>
  `,
})
export class NotFoundFrameComponent {

}
