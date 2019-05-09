import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar.component';
import { CalendarInputComponent } from './calendar-input/calendar-input.component';

@NgModule({
  declarations: [
    CalendarComponent,
    CalendarInputComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    CalendarComponent,
    CalendarInputComponent,
  ],
})
export class CalendarModule { }
