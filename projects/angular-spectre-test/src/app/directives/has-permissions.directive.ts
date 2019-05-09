import { Directive, OnInit, TemplateRef, ViewContainerRef, Input, EmbeddedViewRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appHasPermissions]',
})
export class HasPermissionsDirective implements OnInit {
  private _userPermissions = [] as string[]
  private _neededPermissions = [] as string[]
  private _view?: EmbeddedViewRef<any>

  constructor(
    private _templateRef: TemplateRef<any>,
    private _viewContainer: ViewContainerRef,
    private _authService: AuthService,
  ) { }

  ngOnInit() {
    this._authService.tokenChange.subscribe(() => {
      this._userPermissions = this._authService.permissions
      this.updateView()
    })
  }

  @Input()
  set appHasPermissions(value: string[]) {
    this._neededPermissions = value
    this.updateView()
  }

  updateView() {
    if (this.permissionsAreValid) {
      if (!this._view) {
        this._view = this._viewContainer.createEmbeddedView(this._templateRef)
      }
    } else {
      if (this._view) {
        this._viewContainer.clear()
        this._view = undefined
      }
    }
  }

  get permissionsAreValid() {
    for (const permission of this._neededPermissions) {
      if (!this._userPermissions.includes(permission)) {
        return false
      }
    }

    return true
  }
}
