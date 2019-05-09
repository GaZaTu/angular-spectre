// tslint:disable-next-line:max-line-length
import { Component, OnInit, OnDestroy, AfterContentInit, OnChanges, Input, Optional, HostBinding, ViewChild, ElementRef, Output, EventEmitter, TemplateRef, ChangeDetectorRef, ContentChild } from '@angular/core';
import classNames from 'classnames';
import { InputGroupService } from '../form/input/input-group/input-group.service';
import { FormGroupService } from '../form/form-group/form-group.service';
import { ContextMenuService } from '../menu';
import { NgModel, ngModelProvider, Subscribe, hotkey, escapeRegExp } from '../../utils';
import { AutocompleteOptionDirective } from './autocomplete.directives';

export interface Tag {
  name: string
  subtitle?: string
  info?: string
  image?: string
  initials?: string
  href?: string
}

export interface FilteredTag extends Tag {
  nameHtml?: string
  subtitleHtml?: string
  infoHtml?: string
}

// @dynamic
@Component({
  selector: 'spectre-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  providers: [ngModelProvider(AutocompleteComponent)],
})
export class AutocompleteComponent implements NgModel<FilteredTag[]>, OnInit, OnDestroy, AfterContentInit, OnChanges {
  @Input()
  size?: 'sm' | 'md' | 'lg'
  @Input()
  options = [] as FilteredTag[]
  @Input()
  canAddNewTags = false
  @Input()
  maxTagCount = 5
  @Input()
  formControlName?: string

  @Input()
  set tagNames(tagNames: string[] | undefined) {
    this.writeValue((tagNames || []).map(name => ({ name })))
  }

  @Input()
  set optionNames(tagNames: string[] | undefined) {
    this.options = (tagNames || []).map(name => ({ name }))
    this.changeDetectorRef.detectChanges()
  }

  @Input()
  class?: any
  @HostBinding('class')
  get hostClass() {
    return classNames('form-custom-input', 'form-autocomplete', this.class)
  }

  @Output()
  tagNamesChange = new EventEmitter<string[]>()

  tags = [] as FilteredTag[]
  search = ''
  focused = false
  showInput = true
  disabled = false

  filteredOptions = [] as FilteredTag[]
  selectedTag?: FilteredTag

  controlId = Math.random().toString(36).substr(2, 10)

  @ViewChild('searchInput')
  searchInput: ElementRef<HTMLInputElement>

  @ViewChild('menuTemplate')
  menuTemplate?: TemplateRef<any>

  @ContentChild(AutocompleteOptionDirective, { read: TemplateRef })
  optionTemplate?: TemplateRef<any>

  contextMenuRef?: { hide: () => any }

  _onChangeHandler?: (value: FilteredTag[]) => any
  _onTouchedHandler?: () => any

  constructor(
    public ref: ElementRef<HTMLElement>,
    public changeDetectorRef: ChangeDetectorRef,
    public contextMenuService: ContextMenuService,
    @Optional() public inputGroup?: InputGroupService,
    @Optional() public formGroup?: FormGroupService,
  ) {
    this.changeDetectorRef.detach()
  }

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

  ngAfterContentInit() {
    this.changeDetectorRef.detectChanges()
  }

  ngOnChanges() {
    this.updateFilteredOptions()

    if (
      (!this.canAddNewTags && this.tags.length === this.options.length) ||
      (this.maxTagCount && this.tags.length > this.maxTagCount)
    ) {
      this.focused = false
      this.showInput = false
    } else {
      this.showInput = true
    }

    this.changeDetectorRef.detectChanges()
  }

  @Subscribe((self: AutocompleteComponent) => self.inputGroup && self.inputGroup.size)
  onInputGroupSizeChange(value: any) {
    this.size = value
    this.changeDetectorRef.detectChanges()
  }

  @Subscribe((self: AutocompleteComponent) => self.formGroup && self.formGroup.size)
  onFormGroupSizeChange(value: any) {
    this.size = value
    this.changeDetectorRef.detectChanges()
  }

  @Subscribe(() => hotkey('Escape'))
  onEscape() {
    this.focused = false

    if (this.searchInput) {
      (this.searchInput.nativeElement as HTMLInputElement).blur()
    }
  }

  @Subscribe(() => hotkey('ArrowUp'))
  onArrowUp() {
    this.handleArrowKey(index => {
      if (index > 0) {
        this.selectedTag = this.filteredOptions[index - 1]
      }
    })
  }

  @Subscribe(() => hotkey('ArrowDown'))
  onArrowDown() {
    this.handleArrowKey(index => {
      if (index < this.filteredOptions.length - 1) {
        this.selectedTag = this.filteredOptions[index + 1]
      }
    })
  }

  handleArrowKey(setSelectedTag: (index: number) => any) {
    if (!this.focused || !this.filteredOptions.length) {
      return
    }

    const index = this.filteredOptions.indexOf(this.selectedTag)

    setSelectedTag(index)

    if (this.selectedTag) {
      const menu = document.getElementById(`${this.controlId}-menu`)
      const menuItem = document.getElementById(`${this.controlId}-menu-item-${this.selectedTag.name}`)

      menu.scrollTop = menuItem.offsetTop
    }

    this.changeDetectorRef.detectChanges()
  }

  onSearchKeydown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault()

      if (this.selectedTag) {
        this.add(this.selectedTag)
      }
    }
  }

  onSearchKeyup(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.preventDefault()

      const existing = this.options.find(opt => opt.name === this.search)

      if (existing) {
        this.add(existing)
      } else if (this.canAddNewTags && this.search.length > 0) {
        this.add({ name: this.search })
      }
    } else if (event.key.startsWith('Arrow')) {
      return
    } else if (event.key !== 'Tab') {
      this.search = (event.currentTarget as HTMLInputElement).value
    }

    this.updateFilteredOptions()
  }

  update(tags: FilteredTag[] | undefined) {
    this.tags = tags || []
    this.search = ''

    this.updateFilteredOptions()

    if (this._onChangeHandler) {
      this._onChangeHandler(this.tags)
    }

    if (this._onTouchedHandler) {
      this._onTouchedHandler()
    }

    this.tagNamesChange.emit(this.tags.map(tag => tag.name))
    this.changeDetectorRef.detectChanges()
  }

  add(tag: FilteredTag) {
    this.update([...this.tags, tag])
  }

  remove(tag: FilteredTag) {
    this.update(this.tags.filter(t => t !== tag))
  }

  updateFilteredOptions() {
    const search = this.search.toLowerCase()

    this.filteredOptions = this.options
      .map(opt => Object.assign(opt, { foundIn: '', indexOfSearch: 0 }))
      .filter(opt => {
        if (this.tags.find(tag => tag.name === opt.name)) {
          return false
        }

        if (this.search) {
          let index = -1

          // tslint:disable-next-line:no-conditional-assignment
          if (opt.name && (index = opt.name.toLowerCase().indexOf(search)) !== -1) {
            opt.foundIn = 'name'
            index += 100
          // tslint:disable-next-line:no-conditional-assignment
          } else if (opt.subtitle && (index = opt.subtitle.toLowerCase().indexOf(search)) !== -1) {
            opt.foundIn = 'subtitle'
            index += 1000
          // tslint:disable-next-line:no-conditional-assignment
          } else if (opt.info && (index = opt.info.toLowerCase().indexOf(search)) !== -1) {
            opt.foundIn = 'info'
            index += 10000
          }

          if (index === -1) {
            return false
          } else {
            opt.indexOfSearch = index
            return true
          }
        }

        return true
      })
      .map(opt => {
        let nameHtml = opt.name
        let subtitleHtml = opt.subtitle
        let infoHtml = opt.info

        const replace = (str: string) => {
          return str.replace(new RegExp(`(${escapeRegExp(this.search)})`, 'ig'), `<mark>$1</mark>`)
        }

        if (this.search) {
          if (opt.foundIn === 'name') {
            nameHtml = replace(opt.name)
          } else if (opt.foundIn === 'subtitle') {
            subtitleHtml = replace(opt.subtitle)
          } else if (opt.foundIn === 'info') {
            infoHtml = replace(opt.info)
          }
        }

        return Object.assign(opt, { nameHtml, subtitleHtml, infoHtml })
      })
      .sort((a, b) => {
        if (a.indexOfSearch < b.indexOfSearch) {
          return -1
        } else if (a.indexOfSearch > b.indexOfSearch) {
          return 1
        } else {
          if (a.subtitle < b.subtitle) {
            return -1
          } else if (a.subtitle > b.subtitle) {
            return 1
          } else {
            if (a.name < b.name) {
              return -1
            } else if (a.name > b.name) {
              return 1
            } else {
              return 0
            }
          }
        }
      })

    this.selectedTag = this.filteredOptions[0]
    this.changeDetectorRef.detectChanges()
  }

  setFocus(value: boolean) {
    this.focused = value
    this.changeDetectorRef.detectChanges()

    if (this.focused) {
      const rect = this.ref.nativeElement.getBoundingClientRect()

      this.contextMenuRef = this.contextMenuService.show({
        template: this.menuTemplate,
        pos: {
          pageX: (rect.left) + window.scrollX,
          pageY: (rect.top + rect.height) + window.scrollY,
        },
        sticky: true,
      })
    } else if (this.contextMenuRef) {
      this.contextMenuRef.hide()
    }
  }

  onOptionMousedown(option: FilteredTag, event: MouseEvent) {
    if (event.button === 0) {
      this.add(option)
    }
  }

  trackTagFn(index: number, item: FilteredTag) {
    return item.name
  }

  writeValue(value: FilteredTag[] | undefined) {
    this.tags = value || []
    this.changeDetectorRef.detectChanges()
  }

  registerOnChange(handler: (value: FilteredTag[]) => void) {
    this._onChangeHandler = handler
  }

  registerOnTouched(handler: () => void) {
    this._onTouchedHandler = handler
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled
  }
}
