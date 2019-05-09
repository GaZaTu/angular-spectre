// tslint:disable-next-line:max-line-length
import { Component, ViewEncapsulation, Input, ContentChild, TemplateRef, OnInit, OnDestroy, OnChanges, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OpenapiRefAuthIconDirective } from './openapi-ref.directives';
import { OpenApiOperationObject, OpenApiTagObject, OpenApiObject, OpenApiParameterObject } from './openapi';
import { Subscribe } from '../../utils';

interface Route {
  path: string
  method: string
  operation: OpenApiOperationObject
}

interface RouteGroup extends OpenApiTagObject {
  routes: Route[]
}

interface RouteMetaData {
  [path: string]: {
    open?: boolean
  }
}

function arrayFlat<T>(arrays: T[][]) {
  return [].concat.apply([], arrays) as T[]
}

function parseOpenApiObject(openApiObject: OpenApiObject) {
  const methodOrder = {
    get: 4,
    post: 3,
    put: 2,
    delete: 1,
  }

  const flatRoutes = arrayFlat(
    Object.entries(openApiObject.paths)
      .map(([path, object]) => (
        Object.entries(object)
          .map(([method, operation]) => {
            if (operation.requestBody) {
              operation = Object.assign({}, operation)
              operation.parameters = operation.parameters || []
              operation.parameters.push({
                name: 'body',
                in: 'body',
                description: operation.requestBody.description,
                required: operation.requestBody.required,
              })
            }

            return ({ path, method, operation })
          })
          .sort((a, b) => {
            const orderA = methodOrder[a.method] || -1
            const orderB = methodOrder[b.method] || -1

            if (orderA > orderB) {
              return -1
            } else if (orderA < orderB) {
              return 1
            } else {
              return 0
            }
          })
      ))
  )
    .sort((a, b) => {
      if (a.path > b.path) {
        return 1
      } else if (a.path < b.path) {
        return -1
      } else {
        return 0
      }
    })

  const routeGroups = openApiObject.tags
    .map(tag => (
      Object.assign({}, tag, {
        routes: flatRoutes.filter(route => route.operation.tags.includes(tag.name)),
      })
    ))
    .filter(tag => tag.routes.length > 0)
    .sort((a, b) => {
      if (a.name > b.name) {
        return 1
      } else if (a.name < b.name) {
        return -1
      } else {
        return 0
      }
    })

  return routeGroups
}

// @dynamic
@Component({
  selector: 'spectre-openapi-ref',
  templateUrl: './openapi-ref.component.html',
  styleUrls: ['./openapi-ref.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OpenapiRefComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  set spec(value: OpenApiObject) {
    this.openApiObject = value

    if (value) {
      this.routeGroups = parseOpenApiObject(value)
    }
  }

  @ContentChild(OpenapiRefAuthIconDirective, { read: TemplateRef })
  authIconTemplate?: TemplateRef<any>

  openApiObject?: OpenApiObject
  routeGroups?: RouteGroup[]

  routeMetaData = new Proxy({}, {
    get: (data, p) => {
      return (data[p] = data[p] || {})
    },
  }) as RouteMetaData

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public route: ActivatedRoute,
    public router: Router,
  ) {
    this.changeDetectorRef.detach()
  }

  ngOnInit() {
    this.changeDetectorRef.detectChanges()
  }

  ngOnDestroy() { }

  ngOnChanges() {
    this.changeDetectorRef.detectChanges()
  }

  @Subscribe((self: OpenapiRefComponent) => self.route.fragment)
  onRouteFragmentChange(fragment: string) {
    if (fragment && fragment.startsWith('route:')) {
      this.routeMetaData[fragment.replace('route:', '')].open = true
    }

    this.changeDetectorRef.detectChanges()
  }

  getRouteSecurity(route: Route) {
    return Object.entries(route.operation.security[0])
      .map(([_, roles]) => roles)
      .find(() => true)
      .join(', ')
  }

  getRouteParameters(route: Route) {
    return route.operation.parameters
  }

  getRouteResponses(route: Route) {
    return Object.entries(route.operation.responses)
      .map(([code, response]) => Object.assign({}, response, { code }))
  }

  getRouteParameterSchema(parameter: OpenApiParameterObject) {
    let schema = parameter.schema

    if (schema.$ref) {
      const refPath = schema.$ref.replace('#/', '')
      const refSchema = refPath.split('/')
        .reduce((o, i) => o ? o[i] : undefined, this.openApiObject)

      schema = refSchema
    }

    return JSON.stringify(schema, undefined, 2)
  }

  isRouteOpen(route: Route) {
    return this.routeMetaData[route.method + route.path].open
  }

  onRouteOpenChange(route: Route, open: boolean) {
    this.routeMetaData[route.method + route.path].open = open
    this.changeDetectorRef.detectChanges()
  }
}
