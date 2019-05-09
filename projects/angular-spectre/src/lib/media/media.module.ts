import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModule } from '../form';
import { AvatarComponent } from './avatar/avatar.component';
import { BadgeDirective } from './badge/badge.directive';
import { CardComponent } from './card/card.component';
import { ChipComponent } from './chip/chip.component';
import { CodeComponent } from './code/code.component';
import { ColumnsComponent } from './columns/columns.component';
import { ColumnComponent } from './columns/column/column.component';
import { DividerComponent } from './divider/divider.component';
import { EmptyComponent } from './empty/empty.component';
import { IconDirective } from './icon/icon.directive';
import { ImageComponent } from './image/image.component';
import { LabelComponent } from './label/label.component';
import { PopoverDirective } from './popover/popover.directive';
import { ProgressComponent } from './progress/progress.component';
import { TileComponent } from './tile/tile.component';
import { TooltipDirective } from './tooltip/tooltip.directive';
// container directives
import { CardTitleDirective, CardSubtitleDirective, CardBodyDirective, CardFooterDirective } from './card/card.directives';
import { EmptyIconDirective, EmptyTitleDirective, EmptySubtitleDirective } from './empty/empty.directives';
// tslint:disable-next-line:max-line-length
import { TileIconDirective, TileIconBoxDirective, TileTitleDirective, TileSubtitleDirective, TileContentDirective, TileActionDirective } from './tile/tile.directives';

@NgModule({
  declarations: [
    AvatarComponent,
    BadgeDirective,
    CardComponent,
    ChipComponent,
    CodeComponent,
    ColumnsComponent,
    ColumnComponent,
    DividerComponent,
    EmptyComponent,
    IconDirective,
    ImageComponent,
    LabelComponent,
    PopoverDirective,
    ProgressComponent,
    TileComponent,
    TooltipDirective,
    // container directives
    CardTitleDirective,
    CardSubtitleDirective,
    CardBodyDirective,
    CardFooterDirective,
    EmptyIconDirective,
    EmptyTitleDirective,
    EmptySubtitleDirective,
    TileIconDirective,
    TileIconBoxDirective,
    TileTitleDirective,
    TileSubtitleDirective,
    TileContentDirective,
    TileActionDirective,
  ],
  imports: [
    CommonModule,
    FormModule,
  ],
  exports: [
    AvatarComponent,
    BadgeDirective,
    CardComponent,
    ChipComponent,
    CodeComponent,
    ColumnsComponent,
    ColumnComponent,
    DividerComponent,
    EmptyComponent,
    IconDirective,
    ImageComponent,
    LabelComponent,
    PopoverDirective,
    ProgressComponent,
    TileComponent,
    TooltipDirective,
    // container directives
    CardTitleDirective,
    CardSubtitleDirective,
    CardBodyDirective,
    CardFooterDirective,
    EmptyIconDirective,
    EmptyTitleDirective,
    EmptySubtitleDirective,
    TileIconDirective,
    TileIconBoxDirective,
    TileTitleDirective,
    TileSubtitleDirective,
    TileContentDirective,
    TileActionDirective,
  ],
})
export class MediaModule { }
