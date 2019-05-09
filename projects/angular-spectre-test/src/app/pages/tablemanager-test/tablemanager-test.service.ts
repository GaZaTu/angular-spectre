import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { GenericApi } from 'angular-spectre';

export interface TablemanagerTest {
  [key: string]: any
}

@Injectable({
  providedIn: 'root',
})
export class TablemanagerTestService implements GenericApi<TablemanagerTest> {
  path = '/tablemanager-test'
  schema = ''
  table = ''
  idKey = 'name'

  testData = [
    // tslint:disable-next-line:max-line-length
    { name: 'Austin', genderId: 1, company: 'Swimlane iwefqiofniqonf qwdmqwddd qwdooood ""dqwdqwdqd "dqdwqd"\n qwdqwiodjqiwd xdddd abvc 123', num: 2, info: 'daijidjqwidjqw qwidjqwidj idqwiodj Test 123 Hello World!', gender: { genderId: 1, name: 'Male' } },
    // tslint:disable-next-line:max-line-length
    { name: 'Dany', genderId: 1, company: 'KFC', num: 1, detail: [{ method: 'Telephone', value: '12345' }, { method: 'EMail', value: 'test@test.com' }], gender: { genderId: 1, name: 'Male' } },
    { name: 'Molly', genderId: 2, company: 'Burger King', num: 3, gender: { genderId: 2, name: 'Female' } },
  ]

  constructor(
    private _api: ApiService,
  ) { }

  get(params?: any) {
    // return this._api.get<TablemanagerTest[]>(`${this.path}`, { params })

    console.log('get', this.path)
      ;
    (this._api as any).requestStart()

    const XDDD = Math.random().toString(36).substr(2, 10)

    setTimeout(() => {
      (this._api as any).handleRequestEvent({
        type: 3,
        loaded: 1,
        total: 100,
      }, XDDD)
    }, 500)

    setTimeout(() => {
      (this._api as any).handleRequestEvent({
        type: 3,
        loaded: 20,
        total: 100,
      }, XDDD)
    }, 1000)

    setTimeout(() => {
      (this._api as any).handleRequestEvent({
        type: 3,
        loaded: 40,
        total: 100,
      }, XDDD)
    }, 1500)

    setTimeout(() => {
      (this._api as any).handleRequestEvent({
        type: 3,
        loaded: 60,
        total: 100,
      }, XDDD)
    }, 2000)

    setTimeout(() => {
      (this._api as any).handleRequestEvent({
        type: 3,
        loaded: 80,
        total: 100,
      }, XDDD)
    }, 2500)

    setTimeout(() => {
      (this._api as any).handleRequestEvent({
        type: 3,
        loaded: 100,
        total: 100,
      }, XDDD)
    }, 2999)

    return new Promise<TablemanagerTest[]>(resolve => {
      setTimeout(() => {
        resolve(this.testData.map(r => Object.assign({}, r)))
          ;
        (this._api as any).requestEnd()
      }, 3000)
    })
  }

  post(data: Partial<TablemanagerTest>) {
    // return this._api.post<TablemanagerTest>(`${this.path}`, data)

    console.log('post', this.path)
      ;
    (this._api as any).requestStart()

    return new Promise<TablemanagerTest>(resolve => {
      setTimeout(() => {
        this.testData.push(Object.assign({}, data as any))
        resolve(Object.assign({}, data))
          ;
        (this._api as any).requestEnd()
      }, 1000)
    })
  }

  id(id: any) {
    return {
      get: () => {
        // return this._api.get<TablemanagerTest>(`${this.path}/${id}`)

        console.log('get', this.path, id)
          ;
        (this._api as any).requestStart()

        return new Promise<TablemanagerTest>(resolve => {
          setTimeout(() => {
            resolve(Object.assign({}, this.testData.find(r => r[this.idKey] === id)))
              ;
            (this._api as any).requestEnd()
          }, 1000)
        })
      },
      put: (data: Partial<TablemanagerTest>) => {
        // return this._api.put<void>(`${this.path}/${id}`, data)

        console.log('put', this.path, id)
          ;
        (this._api as any).requestStart()

        return new Promise<void>(resolve => {
          setTimeout(() => {
            Object.assign(this.testData.find(r => r[this.idKey] === id), data)
            resolve()
              ;
            (this._api as any).requestEnd()
          }, 1000)
        })
      },
      delete: () => {
        // return this._api.delete<void>(`${this.path}/${id}`)

        console.log('delete', this.path, id)
          ;
        (this._api as any).requestStart()

        return new Promise<void>(resolve => {
          setTimeout(() => {
            this.testData.splice(this.testData.findIndex(r => r[this.idKey] === id), 1)
            resolve()
              ;
            (this._api as any).requestEnd()
          }, 1000)
        })
      },
    }
  }

  defaultValues() {
    return {
      num: 1,
    }
  }

  get loading() {
    return this._api.loading
  }

  get progress() {
    return this._api.progress
  }
}
