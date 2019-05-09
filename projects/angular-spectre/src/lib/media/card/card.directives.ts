import { Directive } from '@angular/core';

@Directive({
  selector: '[spectreCardTitle]',
})
export class CardTitleDirective { }

@Directive({
  selector: '[spectreCardSubtitle]',
})
export class CardSubtitleDirective { }

@Directive({
  selector: '[spectreCardBody]',
})
export class CardBodyDirective { }

@Directive({
  selector: '[spectreCardFooter]',
})
export class CardFooterDirective { }
