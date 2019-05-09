import { Component, OnInit, OnDestroy, OnChanges, Input, Output, EventEmitter, HostBinding, Optional } from '@angular/core';
import { NgModel, ngModelProvider } from '../../utils';
import classNames from 'classnames';
import { FormGroupService } from '../form/form-group/form-group.service';

export interface CalendarDateItem {
  key?: string | number
  date: Date
  dateStr: string
  number: number
  today?: boolean
  tooltip?: string
  disabled?: boolean
  prevMonth?: boolean
  nextMonth?: boolean
  selected?: boolean
}

export interface CalendarInputDateItem {
  date: Date
  tooltip?: string
  badge?: string
  disabled?: boolean
  events?: any
}

export interface CalendarRange {
  start: Date
  end: Date
}

@Component({
  selector: 'spectre-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [ngModelProvider(CalendarComponent)],
})
export class CalendarComponent implements NgModel<string>, OnInit, OnDestroy, OnChanges {
  @Input()
  size?: 'md' | 'lg'
  @Input()
  dates?: CalendarInputDateItem[]
  @Input()
  ranges?: CalendarRange[]
  @Input()
  formControlName?: string

  @Input()
  class?: any
  @HostBinding('class')
  get hostClass() {
    return classNames('calendar', this.class)
  }

  @Output()
  dateClick = new EventEmitter<{ date: CalendarDateItem, event: MouseEvent }>()
  @Output()
  dateContextMenu = new EventEmitter<{ date: CalendarDateItem, event: MouseEvent }>()

  value = ''
  disabled = false

  month = new Date()
  navigated = false

  _onChangeHandler?: (value: string) => any
  _onTouchedHandler?: () => any

  constructor(
    @Optional() public formGroup?: FormGroupService,
  ) { }

  ngOnInit() {
    if (this.formGroup && !this.formGroup.formControlName.value) {
      this.formGroup.formControlName.next(this.formControlName)
    }
  }

  ngOnDestroy() {
    if (this.formGroup && this.formGroup.formControlName.value === this.formControlName) {
      this.formGroup.formControlName.next(undefined)
    }
  }

  ngOnChanges() {
    if (!this.navigated) {
      return {
        month: this.value ? new Date(this.value) : new Date(),
      }
    }

    return null
  }

  moveToMonth(monthIndex: number) {
    const month = new Date(this.month)
    month.setMonth(monthIndex)
    this.month = month
    this.navigated = true
  }

  prevMonth() {
    this.moveToMonth(this.month.getMonth() - 1)
  }

  nextMonth() {
    this.moveToMonth(this.month.getMonth() + 1)
  }

  onDateItemClick(date: CalendarDateItem, event: MouseEvent) {
    this.dateClick.emit({ date, event })

    this.value = date.dateStr

    if (this._onChangeHandler) {
      this._onChangeHandler(this.value)
    }

    if (this._onTouchedHandler) {
      this._onTouchedHandler()
    }
  }

  onDateItemContextMenu(date: CalendarDateItem, event: MouseEvent) {
    this.dateContextMenu.emit({ date, event })
  }

  trackDateItemFn(index: number, date: CalendarDateItem) {
    return date.key
  }

  writeValue(value: string) {
    this.value = value
    this.month = value ? new Date(value) : new Date()
    this.navigated = false
  }

  registerOnChange(handler: (value: string) => void) {
    this._onChangeHandler = handler
  }

  registerOnTouched(handler: () => void) {
    this._onTouchedHandler = handler
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled
  }

  get dateItems() {
    const result = [] as CalendarDateItem[]
    const today = new Date()
    const month = this.month
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1, 12)
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0, 12)
    const firstWeekday = (firstDay.getDay() || 7) - 1
    const LastWeekday = 7 - ((lastDay.getDay() || 7) - 1)
    const date = new Date(firstDay)

    date.setDate(date.getDate() - firstWeekday)

    for (let i = (0 - firstWeekday); i < (lastDay.getDate() - 1 + LastWeekday); i++) {
      result.push({
        key: i,
        date: new Date(date),
        dateStr: date.toISOString().slice(0, date.toISOString().indexOf('T')),
        number: date.getDate(),
        today: date.toDateString() === today.toDateString(),
        prevMonth: i < 0,
        nextMonth: i > (lastDay.getDate() - 1),
        selected: this.valueAsDate && (date.toDateString() === this.valueAsDate.toDateString()),
      })
      date.setDate(date.getDate() + 1)
    }

    return result
  }

  get currentMonth() {
    const formatter = new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'long' })

    return formatter.format(this.month)
  }

  get weekdays() {
    const formatter = new Intl.DateTimeFormat(undefined, { weekday: 'short' })
    const weekdays = [] as string[]
    const date = new Date('2019-01-28')

    for (let i = 0; i < 7; i++) {
      weekdays.push(formatter.format(date))
      date.setDate(date.getDate() + 1)
    }

    return weekdays
  }

  get valueAsDate() {
    return this.value ? new Date(this.value) : undefined
  }
}
