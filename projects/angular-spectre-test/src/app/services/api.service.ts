import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpEvent, HttpResponse, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subject, of as observableOf, Observable } from 'rxjs';
import { tap, filter, map, first } from 'rxjs/operators';
import { webSocket, WebSocketSubjectConfig } from 'rxjs/webSocket';
// import { ToastService } from 'angular-spectre';

interface LoadStartEvent {
  type: 'load-start'
}

interface LoadEndEvent {
  type: 'load-end'
}

interface ProgressEvent {
  type: 'progress'
  loaded: number
  total: number
}

type ApiEvent = LoadStartEvent | LoadEndEvent | ProgressEvent

interface RequestOptions<O extends 'body' | 'events' | 'response', R extends 'json' | 'arraybuffer' | 'blob' | 'text'> {
  headers?: HttpHeaders | { [header: string]: string | string[] }
  observe?: O
  params?: HttpParams | { [param: string]: string | string[] }
  reportProgress?: boolean
  responseType?: R
  withCredentials?: boolean
  mergeQueryParams?: boolean
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  host = location.host
  path = ''

  errors = new Subject<HttpErrorResponse>()

  private _loadingCounter = 0
  private _apiEvents = new Subject<ApiEvent>()

  private _requestProgressEventMap = new Map<Observable<any>, ProgressEvent>()

  constructor(
    private _http: HttpClient,
    private _route: ActivatedRoute,
  ) { }

  private requestStart() {
    this._loadingCounter++

    if (this._loadingCounter === 1) {
      this._apiEvents.next({
        type: 'load-start',
      })
    }
  }

  private requestEnd() {
    this._loadingCounter--

    if (this._loadingCounter === 0) {
      this._apiEvents.next({
        type: 'load-end',
      })
    }
  }

  private handleRequestEvent(event: HttpEvent<any>, observable: Observable<any>) {
    if (event.type === HttpEventType.DownloadProgress || event.type === HttpEventType.UploadProgress) {
      if (event.total) {
        let loaded = 0
        let total = 0

        if (event.loaded === event.total) {
          this._requestProgressEventMap.delete(observable)
        } else {
          this._requestProgressEventMap.set(observable, {
            type: 'progress' as any,
            loaded: event.loaded,
            total: event.total,
          })
        }

        for (const progress of this._requestProgressEventMap.values()) {
          loaded += progress.loaded
          total += progress.total
        }

        this._apiEvents.next({
          type: 'progress' as any,
          loaded,
          total,
        })
      }
    }
  }

  private handleRequestError(error: HttpErrorResponse) {
    this.errors.next(error)
    this.requestEnd()
  }

  private mapRequestPath(path: string, ws = false) {
    const protocol = path.slice(0, path.indexOf('://'))
    const isFullPath = ['http', 'https', 'ws', 'wss'].includes(protocol)
    let requestProtocol = location.protocol

    if (ws) {
      if (requestProtocol === 'http:') {
        requestProtocol = 'ws:'
      } else if (requestProtocol === 'https:') {
        requestProtocol = 'wss:'
      }
    }

    return isFullPath ? path : `${requestProtocol}//${this.baseUri}${path}`
  }

  private doRequest(method: 'GET' | 'POST' | 'PUT' | 'DELETE', path: string, body?: any, options?: RequestOptions<any, any>) {
    path = this.mapRequestPath(path)

    this.requestStart()

    let observable: Observable<any>

    if (options && options.mergeQueryParams) {
      options.params = Object.assign({}, this.queryParams, options.params)
    }

    if (method === 'GET') {
      observable = this._http.get(path, options)
    } else if (method === 'POST') {
      observable = this._http.post(path, body, options)
    } else if (method === 'PUT') {
      observable = this._http.put(path, body, options)
    } else if (method === 'DELETE') {
      observable = this._http.delete(path, options)
    } else {
      throw new Error(`Unsupported HTTP method '${method}'`)
    }

    return observable
      .pipe(
        tap({
          next: (options.observe === 'events') && (value => this.handleRequestEvent(value, observable)),
          error: error => this.handleRequestError(error),
          complete: () => this.requestEnd(),
        })
      )
  }

  get<T>(path: string, options?: RequestOptions<'body', 'json'>): Observable<T>
  get<T>(path: string, options?: RequestOptions<'events', 'json'>): Observable<HttpEvent<T>>
  get<T>(path: string, options?: RequestOptions<'response', 'json'>): Observable<HttpResponse<T>>
  get(path: string, options?: RequestOptions<'body', 'arraybuffer'>): Observable<ArrayBuffer>
  get(path: string, options?: RequestOptions<'events', 'arraybuffer'>): Observable<HttpEvent<ArrayBuffer>>
  get(path: string, options?: RequestOptions<'response', 'arraybuffer'>): Observable<HttpResponse<ArrayBuffer>>
  get(path: string, options?: RequestOptions<'body', 'blob'>): Observable<Blob>
  get(path: string, options?: RequestOptions<'events', 'blob'>): Observable<HttpEvent<Blob>>
  get(path: string, options?: RequestOptions<'response', 'blob'>): Observable<HttpResponse<Blob>>
  get(path: string, options?: RequestOptions<'body', 'text'>): Observable<string>
  get(path: string, options?: RequestOptions<'events', 'text'>): Observable<HttpEvent<string>>
  get(path: string, options?: RequestOptions<'response', 'text'>): Observable<HttpResponse<string>>
  get(path: string, options?: RequestOptions<any, any>): Observable<any> {
    return this.doRequest('GET', path, undefined, options)
  }

  post<T>(path: string, body?: any, options?: RequestOptions<'body', 'json'>): Observable<T>
  post<T>(path: string, body?: any, options?: RequestOptions<'events', 'json'>): Observable<HttpEvent<T>>
  post<T>(path: string, body?: any, options?: RequestOptions<'response', 'json'>): Observable<HttpResponse<T>>
  post(path: string, body?: any, options?: RequestOptions<'body', 'arraybuffer'>): Observable<ArrayBuffer>
  post(path: string, body?: any, options?: RequestOptions<'events', 'arraybuffer'>): Observable<HttpEvent<ArrayBuffer>>
  post(path: string, body?: any, options?: RequestOptions<'response', 'arraybuffer'>): Observable<HttpResponse<ArrayBuffer>>
  post(path: string, body?: any, options?: RequestOptions<'body', 'blob'>): Observable<Blob>
  post(path: string, body?: any, options?: RequestOptions<'events', 'blob'>): Observable<HttpEvent<Blob>>
  post(path: string, body?: any, options?: RequestOptions<'response', 'blob'>): Observable<HttpResponse<Blob>>
  post(path: string, body?: any, options?: RequestOptions<'body', 'text'>): Observable<string>
  post(path: string, body?: any, options?: RequestOptions<'events', 'text'>): Observable<HttpEvent<string>>
  post(path: string, body?: any, options?: RequestOptions<'response', 'text'>): Observable<HttpResponse<string>>
  post(path: string, body: any, options?: RequestOptions<any, any>) {
    return this.doRequest('POST', path, body, options)
  }

  put<T>(path: string, body: any, options?: RequestOptions<'body', 'json'>): Observable<T>
  put<T>(path: string, body: any, options?: RequestOptions<'events', 'json'>): Observable<HttpEvent<T>>
  put<T>(path: string, body: any, options?: RequestOptions<'response', 'json'>): Observable<HttpResponse<T>>
  put(path: string, body: any, options?: RequestOptions<'body', 'arraybuffer'>): Observable<ArrayBuffer>
  put(path: string, body: any, options?: RequestOptions<'events', 'arraybuffer'>): Observable<HttpEvent<ArrayBuffer>>
  put(path: string, body: any, options?: RequestOptions<'response', 'arraybuffer'>): Observable<HttpResponse<ArrayBuffer>>
  put(path: string, body: any, options?: RequestOptions<'body', 'blob'>): Observable<Blob>
  put(path: string, body: any, options?: RequestOptions<'events', 'blob'>): Observable<HttpEvent<Blob>>
  put(path: string, body: any, options?: RequestOptions<'response', 'blob'>): Observable<HttpResponse<Blob>>
  put(path: string, body: any, options?: RequestOptions<'body', 'text'>): Observable<string>
  put(path: string, body: any, options?: RequestOptions<'events', 'text'>): Observable<HttpEvent<string>>
  put(path: string, body: any, options?: RequestOptions<'response', 'text'>): Observable<HttpResponse<string>>
  put(path: string, body: any, options?: RequestOptions<any, any>) {
    return this.doRequest('PUT', path, body, options)
  }

  delete<T>(path: string, options?: RequestOptions<'body', 'json'>): Observable<T>
  delete<T>(path: string, options?: RequestOptions<'events', 'json'>): Observable<HttpEvent<T>>
  delete<T>(path: string, options?: RequestOptions<'response', 'json'>): Observable<HttpResponse<T>>
  delete(path: string, options?: RequestOptions<'body', 'arraybuffer'>): Observable<ArrayBuffer>
  delete(path: string, options?: RequestOptions<'events', 'arraybuffer'>): Observable<HttpEvent<ArrayBuffer>>
  delete(path: string, options?: RequestOptions<'response', 'arraybuffer'>): Observable<HttpResponse<ArrayBuffer>>
  delete(path: string, options?: RequestOptions<'body', 'blob'>): Observable<Blob>
  delete(path: string, options?: RequestOptions<'events', 'blob'>): Observable<HttpEvent<Blob>>
  delete(path: string, options?: RequestOptions<'response', 'blob'>): Observable<HttpResponse<Blob>>
  delete(path: string, options?: RequestOptions<'body', 'text'>): Observable<string>
  delete(path: string, options?: RequestOptions<'events', 'text'>): Observable<HttpEvent<string>>
  delete(path: string, options?: RequestOptions<'response', 'text'>): Observable<HttpResponse<string>>
  delete(path: string, options?: RequestOptions<any, any>) {
    return this.doRequest('DELETE', path, undefined, options)
  }

  webSocket<T>(urlConfigOrSource: string | WebSocketSubjectConfig<T>) {
    if (typeof urlConfigOrSource === 'string') {
      urlConfigOrSource = this.mapRequestPath(urlConfigOrSource, true)
    } else {
      urlConfigOrSource.url = this.mapRequestPath(urlConfigOrSource.url, true)
    }

    return webSocket<T>(urlConfigOrSource)
  }

  get isLoading() {
    return (this._loadingCounter > 0)
  }

  get onLoad() {
    if (this._loadingCounter === 0) {
      return Promise.resolve()
    } else {
      return this._apiEvents.pipe(
        filter(e => e.type === 'load-end'),
        map(e => undefined as void),
        first(),
      ).toPromise()
    }
  }

  get loading() {
    return this._apiEvents
      .pipe(
        filter(event => event.type === 'load-start' || event.type === 'load-end'),
        map(event => event.type === 'load-start'),
      )
  }

  get progress() {
    return this._apiEvents
      .pipe(
        filter(event => event.type === 'progress'),
        map(event => event as ProgressEvent),
      )
  }

  get params() {
    return this._route.snapshot.params
  }

  get queryParams() {
    return this._route.snapshot.queryParams
  }

  get baseUri() {
    return this.host + this.path
  }
}
