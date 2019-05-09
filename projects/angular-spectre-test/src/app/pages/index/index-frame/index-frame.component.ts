import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModalService, ToastService, TryOrToast, ContextMenuService, ConfigService, KanbanMoveEvent, TreeNodeMoveEvent } from 'angular-spectre';
import { timer, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { OffcanvasService } from 'angular-spectre';
import { ActivatedRoute } from '@angular/router';

interface TaskStatus {
  taskStatusId: string
  name: string
  index: number
}

interface Task {
  taskId: string
  taskStatusId: string
  name: string
  taskStatusName: string
  taskAreaName: string
}

// @FullscreenFrame()
@Component({
  selector: 'app-index-frame',
  templateUrl: './index-frame.component.html',
})
export class IndexFrameComponent implements AfterViewInit {
  boolValue = true
  strValue = ''
  anyValue = undefined
  tabs = [{ name: 'Tab1' }, { name: 'Tab2' }, { name: 'Tab3' }]
  tags = []
  dateStr = ''
  formSize = 'sm'
  cardTitle = 'Hello World.'

  form = this.fb.group({
    input: ['', [], [this.asyncValidator]],
    select: [''],
    autocomplete: [[]],
  })

  rowsRaw = [
    // tslint:disable-next-line:max-line-length
    { name: 'Austin', genderId: 1, company: 'Swimlane iwefqiofniqonf qwdmqwddd qwdooood ""dqwdqwdqd "dqdwqd"\n qwdqwiodjqiwd xdddd abvc 123', num: 2, info: 'daijidjqwidjqw qwidjqwidj idqwiodj Test 123 Hello World!', gender: { genderId: 1, name: 'Male' } },
    // tslint:disable-next-line:max-line-length
    { name: 'Dany', genderId: 1, company: 'KFC', num: 1, detail: [{ method: 'Telephone', value: '12345' }, { method: 'EMail', value: 'test@test.com' }], gender: { genderId: 1, name: 'Male' } },
    { name: 'Molly', genderId: 2, company: 'Burger King', num: 3, gender: { genderId: 2, name: 'Female' } },
  ]

  // tslint:disable-next-line:max-line-length
  tableData = new Promise(resolve => setTimeout(() => resolve([{ firstName: 'fname1', lastName: 'lname1', age: 10, active: true, date: new Date('2020-04-18').toISOString() }, { firstName: 'fname2', lastName: null, age: 20, active: false }, { firstName: 'fname3', lastName: 'lname3', age: 20, active: null }, { firstName: 'fname1', lastName: 'lname1', age: 10, active: true }, { firstName: 'fname2', lastName: 'lname2', age: 20, active: false }, { firstName: 'fname3', lastName: 'Dies ist ein sehr langer Text.\nIch mache das nur zum testen. Jetzt kommt ein \\n um zu testen wie das Aussieht.\n\t\\t muss auch getestet werden.\n  Zwei leerzeichen sollten auch funktionieren.', age: 20, active: true }, { firstName: 'fname1', lastName: 'lname1', age: 10, active: true }, { firstName: 'fname2', lastName: 'lname2', age: 2, active: false, date: new Date('2018-04-18').toISOString() }, { firstName: 'fname2', lastName: 'lname2', age: 1, active: false, date: new Date('2019-04-18').toISOString() }, { firstName: 'fname3', lastName: 'lname3', age: 20, active: true }, { firstName: 'fname1', lastName: 'lname1', age: 10, active: true }, { firstName: 'fname2', lastName: 'lname2', age: 20, active: false }, { firstName: 'fname3', lastName: 'lname3', age: 20, active: true }, { firstName: 'fname1', lastName: undefined, age: 10, active: true }, { firstName: 'fname2', lastName: 'lname2', age: 20, active: false }, { firstName: 'fname2', lastName: 'lname2', age: null, active: false }, { firstName: 'fname3', lastName: 'lname3', age: 20, active: true }, { firstName: 'fname1', lastName: 'lname1', age: 10, active: true, date: new Date('2019-02-18').toISOString() }, { firstName: 'fname2', lastName: 'lname2', age: 20, active: false }, { firstName: 'fname3', lastName: 'lname3', age: 3, active: true }, { firstName: 'fname1', lastName: 'lname1', age: null, active: true, date: new Date('2019-04-20').toISOString() }, { firstName: undefined, lastName: 'lname2', age: 20, active: false }].map(r => Object.assign({}, r, { id: Math.random().toString(36).substr(2, 10) }))), 5000))

  rows = this.rowsRaw
  loading = false
  counter = 0
  activeTab = undefined

  lookupData = {
    // gender: {
    //   1: 'Male',
    //   2: 'Female',
    // },
  }

  taskStati: TaskStatus[] = [
    {
      taskStatusId: 'cbb4d184-8f3b-492e-aa6d-0eb61c301142',
      name: '1. Backlog',
      index: 1,
    },
    {
      taskStatusId: '30cb8667-b3a1-471c-8fcf-a7cf826a3e32',
      name: '2. Zur Diskussion',
      index: 2,
    },
    {
      taskStatusId: '4c41ddce-82d9-4ca2-98a0-22cfc685419b',
      name: '3. Freigegeben',
      index: 3,
    },
    {
      taskStatusId: 'efdc7736-b923-4f15-9fc5-30c0f62aed84',
      name: '4. In Arbeit',
      index: 4,
    },
    {
      taskStatusId: '3d846e23-ae2b-4ba9-bcfd-7d117bbecd4a',
      name: '5. Zur Abnahme',
      index: 5,
    },
    {
      taskStatusId: 'dd98287c-2bae-4b07-a001-0d0dce375b54',
      name: '6. Fertig',
      index: 6,
    },
  ]

  tasks: Task[] = [
    {
      taskId: '9f0df3a4-a922-4a02-8d2f-a8a3ec13ad5c',
      taskStatusId: '4c41ddce-82d9-4ca2-98a0-22cfc685419b',
      name: 'WVL - Volltextsuche mit Ansprechpartner finden',
      taskStatusName: '3. Freigegeben',
      taskAreaName: 'Portal - CRM',
    },
    {
      taskId: '6483a80b-83f3-4508-a16e-bc58a6d0a250',
      taskStatusId: '4c41ddce-82d9-4ca2-98a0-22cfc685419b',
      name: 'Dateien - Anzeige Archivkennzeichen und Dateigröße korrigieren',
      taskStatusName: '3. Freigegeben',
      taskAreaName: 'Portal - CRM',
    },
    {
      taskId: '1d67bd8a-5b49-4806-a170-c7246a356a05',
      taskStatusId: '4c41ddce-82d9-4ca2-98a0-22cfc685419b',
      name: 'MIME - Chrome Erweiterungen',
      taskStatusName: '3. Freigegeben',
      taskAreaName: 'Portal - CRM',
    },
    {
      taskId: '5ea49306-7f5f-40b8-b409-4178d805c448',
      taskStatusId: '4c41ddce-82d9-4ca2-98a0-22cfc685419b',
      name: 'Download aus "Dateien"',
      taskStatusName: '3. Freigegeben',
      taskAreaName: 'Portal - CRM',
    },
  ]

  kanbanBoards = [] as (TaskStatus & { tasks: Task[] })[]

  treeBranches = [{ id: '1', parentId: null, index: 0 }, { id: '1.1', parentId: '1', index: 0 }, { id: '1.2', parentId: '1', index: 1 }]
  treeLeafs = [{ id: '1.3', parentId: '1', index: 2 }, { id: '1.1.1', parentId: '1.1', index: 0 }]
  selectedTreeBranches = []
  selectedTreeLeafs = []

  constructor(
    public modalService: ModalService,
    public toastService: ToastService,
    public contextMenuService: ContextMenuService,
    public fb: FormBuilder,
    public ref: ElementRef,
    public authService: AuthService,
    public translate: TranslateService,
    public configService: ConfigService,
    public route: ActivatedRoute,
    public offcanvasService: OffcanvasService,
  ) {
    this.updateKanbanBoards()
  }

  ngAfterViewInit() {
    // setTimeout(() => {
    //   this.formSize = 'sm'
    //   this.cardTitle = 'Hello World!!!!!!!'
    // }, 5000)
  }

  handleClick(event: any) {
    console.log(event)
  }

  handleCloseTab(tabKey: string) {
    this.tabs.splice(this.tabs.findIndex(t => t.name === tabKey), 1)
  }

  handleSubmit(formValue: any) {
    this.form.reset()

    console.log(this.form)
  }

  toggleTableLoadingState() {
    this.loading = !this.loading
    this.rows = this.rows.length ? [] : this.rowsRaw
  }

  toast() {
    this.toastService.primary(`test ${this.counter++}`)
  }

  selectedRows(rows) {
    const values = this.strValue.split('|')

    return rows.filter(r => values.includes(r.value))
  }

  selectRows({ selected }) {
    this.strValue = selected.map(r => r.value).join('|')
  }

  get asyncValidator() {
    return () => {
      return timer(2000).pipe(map(() => null))
    }
  }

  @TryOrToast()
  tryOrToastTest1() {
    return 1
  }

  @TryOrToast()
  tryOrToastTest2() {
    throw 2
  }

  @TryOrToast()
  async tryOrToastTest3() {
    return 3
  }

  @TryOrToast()
  async tryOrToastTest4() {
    throw 4
  }

  tryOrToastTest5() {
    return this.tryOrToastTest5Helper().subscribe(console.log)
  }

  @TryOrToast()
  tryOrToastTest5Helper() {
    return of(5)
  }

  tryOrToastTest6() {
    return this.tryOrToastTest6Helper().subscribe(console.log)
  }

  @TryOrToast()
  tryOrToastTest6Helper() {
    return throwError(6)
  }

  onKanbanItemMove(event: KanbanMoveEvent<TaskStatus, Task>) {
    if (event.sourceBoard === event.targetBoard) {
      return
    }

    event.pause()

    setTimeout(() => {
      event.continue()
      event.item.taskStatusId = event.targetBoard.taskStatusId

      this.updateKanbanBoards()
    }, 5000)
  }

  updateKanbanBoards() {
    this.kanbanBoards = this.taskStati.map(s => (
      Object.assign({}, s, {
        tasks: this.tasks.filter(t => t.taskStatusId === s.taskStatusId),
      })
    ))
  }

  trackRowBy(row: any) {
    return row.firstName
  }

  stringifyDate(value: string) {
    return new Date(value).toLocaleDateString()
  }

  onTreeNodeMove(event: TreeNodeMoveEvent) {
    console.log([...this.treeBranches, ...this.treeLeafs].map(v => Object.assign({}, v)));

    const branchesAndLeafs = [...this.treeBranches, ...this.treeLeafs]

    branchesAndLeafs
      .filter(node => node.id !== event.node.id)
      .filter(node => (!node.parentId && !event.prevParent) || (event.prevParent && node.parentId === event.prevParent.id))
      .filter(node => node.index >= event.prevIndex)
      .forEach(node => node.index -= 1)

    branchesAndLeafs
      .filter(node => (!node.parentId && !event.nextParent) || (event.nextParent && node.parentId === event.nextParent.id))
      .filter(node => node.index >= event.nextIndex)
      .forEach(node => node.index += 1)

    branchesAndLeafs
      .filter(node => node.id === event.node.id)
      .forEach(node => {
        node.parentId = event.nextParent ? event.nextParent.id : null
        node.index = event.nextIndex
      })

    this.treeBranches = [...this.treeBranches]
    this.treeLeafs = [...this.treeLeafs]

    console.log([...this.treeBranches, ...this.treeLeafs].map(v => Object.assign({}, v)));
  }
}
