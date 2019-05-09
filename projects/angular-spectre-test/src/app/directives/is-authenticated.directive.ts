import { Directive, OnInit, OnDestroy, TemplateRef, ViewContainerRef, Input, EmbeddedViewRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscribe } from 'angular-spectre';

@Directive({
  selector: '[appIsAuthenticated]',
})
export class IsAuthenticatedDirective implements OnInit, OnDestroy {
  private _needed = false
  private _view?: EmbeddedViewRef<any>

  constructor(
    private _templateRef: TemplateRef<any>,
    private _viewContainer: ViewContainerRef,
    private _authService: AuthService,
  ) { }

  ngOnInit() { }

  ngOnDestroy() { }

  @Input()
  set appIsAuthenticated(value: boolean | null) {
    this._needed = (value === null) ? true : value
    this.updateView()
  }

  @Subscribe((self: IsAuthenticatedDirective) => self._authService.tokenChange)
  updateView() {
    if (this._authService.isAuthenticated === this._needed) {
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
}
