export interface OpenApiInfoObject {
  title: string
  version?: string
  description?: string
}

export interface OpenApiSecurityDefinitionObject {
  type: 'apiKey'
  name: string
  in: 'header'
}

export interface OpenApiTagObject {
  name: string
  description?: string
  externalDocs?: {
    description: string
    url?: string
  }
}

export interface OpenApiParameterObject {
  name: string
  description?: string
  in?: 'body' | 'query'
  required?: boolean
  deprecated?: boolean
  schema?: {
    $ref: string
    type: string
  }
}

export interface OpenApiResponseObject {
  description: string
}

export interface OpenApiOperationObject {
  operationId: string
  description?: string
  summary?: string
  parameters?: OpenApiParameterObject[]
  responses?: { [code: string]: OpenApiResponseObject }
  consumes?: string[]
  produces?: string[]
  security?: { [name: string]: string[] }[]
  tags?: string[]
  deprecated?: boolean
  requestBody?: {
    description?: string
    required?: boolean
  }
}

export interface OpenApiPathObject {
  [method: string]: OpenApiOperationObject
}

export interface OpenApiComponentsObject {
  securitySchemes: { [name: string]: OpenApiSecurityDefinitionObject }
}

export interface OpenApiServerObject {
  url: string
  description?: string
}

export interface OpenApiObject {
  info?: OpenApiInfoObject
  servers?: OpenApiServerObject[]
  components?: OpenApiComponentsObject
  tags?: OpenApiTagObject[]
  paths?: { [path: string]: OpenApiPathObject }
  definitions?: { [key: string]: any }
}
