declare module "classnames" {
  export = classNames

  function classNames(...args: (string | { [key: string]: any } | boolean | null | undefined)[]): string

  namespace classNames { }
}
