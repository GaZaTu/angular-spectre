import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  static localStorageKey = 'AuthService.token'

  static get token() {
    return localStorage.getItem(AuthService.localStorageKey)
  }

  private _tokenChangeSubject = new Subject<string | undefined>()

  constructor(
    private _jwtHelperService: JwtHelperService,
  ) { }

  hasPermissions(...needed: string[]) {
    const thisPermissions = this.permissions

    for (const permission of needed) {
      if (!thisPermissions.includes(permission)) {
        return false
      }
    }

    return true
  }

  get isAuthenticated() {
    return !this._jwtHelperService.isTokenExpired(this.token)
  }

  get token() {
    return AuthService.token
  }

  set token(token: string | undefined) {
    if (token) {
      localStorage.setItem(AuthService.localStorageKey, token)
    } else {
      localStorage.removeItem(AuthService.localStorageKey)
    }

    this._tokenChangeSubject.next(token)
  }

  get decodedToken() {
    return this._jwtHelperService.decodeToken(this.token)
  }

  get permissions() {
    return ((this.decodedToken || {}).permissions || []) as string[]
  }

  get tokenChange() {
    return this._tokenChangeSubject.asObservable()
  }
}
