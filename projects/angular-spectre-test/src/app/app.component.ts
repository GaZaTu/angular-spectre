import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService, Subscribe, ToastService } from 'angular-spectre';
import { SwUpdate } from '@angular/service-worker';
import { FullscreenService } from './services/fullscreen.service';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  presence = 'online'

  constructor(
    public authService: AuthService,
    public translate: TranslateService,
    public configService: ConfigService,
    public swUpdate: SwUpdate,
    public toastService: ToastService,
    public fullscreenService: FullscreenService,
    public apiService: ApiService,
  ) {
    translate.setDefaultLang('en')
    translate.use('en')

    setTimeout(() => {
      configService.data.next({
        'spectreTable.selectVisible': 'Select visible',
        spectrePagination: {
          prev: 'Prev',
          next: 'Next',
        },
        spectreOpenapiRef: {
          baseUrl: 'Base URL',
          parameters: {
            caption: 'Parameters',
            name: 'Name',
            description: 'Description',
          },
          responses: {
            caption: 'Responses',
            code: 'Code',
            description: 'Description',
          },
        },
      })
    })
  }

  ngOnInit() { }

  ngOnDestroy() { }

  ngAfterViewInit() { }

  @Subscribe((self: AppComponent) => self.swUpdate.available)
  onSwUpdate() {
    location.reload()
  }

  login() {
    // tslint:disable-next-line:max-line-length
    this.authService.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDNmZjU3MS03ODljLTQ4OWYtYWZmZC1kNDMxOWZlYTk1Y2UiLCJhZGRyZXNzSWQiOiIyZmQyZDk4Mi04MDY4LTBjOWQtZDJkMC0wMmU1MjhkMGQzZWIiLCJlbWFpbCI6ImQuYmFsbG1hbm5AZGF0YW5hdXQuZXUiLCJyZWdpc3RlcmVkIjoiMjAxOC0wNy0zMFQxMToyNzo1NC41MTZaIiwibGFzdExvZ2luIjoiMjAxOS0wNC0wOVQwOToyOTo1NC44MjlaIiwiZW1haWxWZXJpZmllZCI6dHJ1ZSwiZGlzYWJsZWQiOmZhbHNlLCJ1c2VybmFtZSI6ImQuYmFsbG1hbm5AZGF0YW5hdXQuZXUiLCJpc01hc3RlciI6ZmFsc2UsInBlcm1pc3Npb25zIjpbXSwiaWF0IjoxNTU0ODE1MjU4LCJleHAiOjE1NTQ4MTg4NTh9.TVa6gqSNEu-4apdvkPT4du3cXwNSgxc4wQjwdqio-yY'
  }

  logout() {
    this.authService.token = null
  }

  testApiProgress() {
    // tslint:disable-next-line:max-line-length
    this.apiService.get('https://projects.datanaut.eu:18696/meta/openapi-spec', { observe: 'events', reportProgress: true }).forEach(event => {
    })
  }
}
