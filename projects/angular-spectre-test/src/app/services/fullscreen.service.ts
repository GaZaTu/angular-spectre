import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FullscreenService {
  fullscreen = new BehaviorSubject<boolean>(false)

  setFullscreen(activate = true) {
    if (activate !== this.isInFullscreen) {
      if (activate) {
        document.documentElement.requestFullscreen()
      } else {
        document.exitFullscreen()
      }

      this.fullscreen.next(activate)
    }
  }

  toggleFullscreen() {
    this.setFullscreen(!this.isInFullscreen)
  }

  get isInFullscreen() {
    return this.fullscreen.value
  }
}
