import { Directive } from '@angular/core';

@Directive({
  selector: '[spectrePanelHeader]',
})
export class PanelHeaderDirective { }

@Directive({
  selector: '[spectrePanelTitle]',
})
export class PanelTitleDirective { }

@Directive({
  selector: '[spectrePanelSubtitle]',
})
export class PanelSubtitleDirective { }

@Directive({
  selector: '[spectrePanelNav]',
})
export class PanelNavDirective { }

@Directive({
  selector: '[spectrePanelBody]',
})
export class PanelBodyDirective { }

@Directive({
  selector: '[spectrePanelFooter]',
})
export class PanelFooterDirective { }
