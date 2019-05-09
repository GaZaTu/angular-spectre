import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FaIconService {
  loadedStylesheet = false

  href = 'https://use.fontawesome.com/releases/v5.8.2/css/all.css'
  integrity = 'sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay'
}
