import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionsGuard implements CanActivate {
  constructor(
    private _router: Router,
    private _authService: AuthService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot) {
    if (this._authService.isAuthenticated && (!route.data.permissions || this._authService.hasPermissions(...route.data.permissions))) {
      return true
    } else {
      this._router.navigate(['/login'])
      return false
    }
  }
}
