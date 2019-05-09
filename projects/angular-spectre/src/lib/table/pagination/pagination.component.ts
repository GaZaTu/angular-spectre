import { Component, OnInit, OnDestroy, AfterViewInit, OnChanges, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ConfigService } from '../../config';
import { Subscribe } from '../../../utils';

interface PageItem {
  text: string
  navigationPage?: number
  active?: boolean
  disabled?: boolean
}

// @dynamic
@Component({
  selector: 'spectre-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input()
  page: number
  @Input()
  pageCount: number

  @Output()
  pageChange = new EventEmitter<number>()

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public configService: ConfigService,
  ) {
    this.changeDetectorRef.detach()
  }

  @Subscribe((self: PaginationComponent) => self.configService.data)
  onConfigChange() {
    this.changeDetectorRef.detectChanges()
  }

  ngOnInit() { }

  ngOnDestroy() { }

  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges()
  }

  ngOnChanges() {
    this.changeDetectorRef.detectChanges()
  }

  navigate(newPage: number) {
    this.pageChange.emit(newPage)
  }

  get pageNumber() {
    return this.page + 1
  }

  get pageItems() {
    const result = [] as PageItem[]
    const pageNumber = this.pageNumber
    const pageCount = this.pageCount

    let addedLeftFiller = false
    let addedRightFiller = false

    result.push({
      text: this.configService.get('spectrePagination.prev'),
      navigationPage: this.page - 1,
      disabled: this.page === 0 || this.pageCount === 0,
    })

    for (let i = 1; i < this.pageCount + 1; i++) {
      // tslint:disable-next-line:max-line-length
      if (i === pageNumber || (i > pageNumber - 3 && i < pageNumber) || (i > pageNumber && i < pageNumber + 3) || i === 1 || i === pageCount) {
        result.push({
          text: String(i),
          navigationPage: i - 1,
          active: i === pageNumber,
        })
      } else if ((i < pageNumber && !addedLeftFiller) || (i > pageNumber && !addedRightFiller)) {
        addedLeftFiller = (i < pageNumber)
        addedRightFiller = (i > pageNumber)

        result.push({
          text: '...',
        })
      }
    }

    result.push({
      text: this.configService.get('spectrePagination.next'),
      navigationPage: this.page + 1,
      disabled: this.page === pageCount - 1 || this.pageCount === 0,
    })

    return result
  }
}
