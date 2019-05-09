import { Directive } from '@angular/core';

@Directive({
  selector: '[spectreTileIcon]',
})
export class TileIconDirective { }

@Directive({
  selector: '[spectreTileIconBox]',
})
export class TileIconBoxDirective { }

@Directive({
  selector: '[spectreTileTitle]',
})
export class TileTitleDirective { }

@Directive({
  selector: '[spectreTileSubtitle]',
})
export class TileSubtitleDirective { }

@Directive({
  selector: '[spectreTileContent]',
})
export class TileContentDirective { }

@Directive({
  selector: '[spectreTileAction]',
})
export class TileActionDirective { }
