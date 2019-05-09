import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { scrollOffset } from './utils/scroll-offset';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/index/index.module').then(m => m.IndexModule),
  },
  {
    path: 'unpadded',
    loadChildren: () => import('./pages/unpadded/unpadded.module').then(m => m.UnpaddedModule),
  },
  {
    path: 'api-ref',
    loadChildren: () => import('./pages/api-ref/api-ref.module').then(m => m.ApiRefModule),
  },
  {
    path: 'tablemanager-test',
    loadChildren: () => import('./pages/tablemanager-test/tablemanager-test.module').then(m => m.TablemanagerTestModule),
  },
  {
    path: '**',
    loadChildren: () => import('./pages/not-found/not-found.module').then(m => m.NotFoundModule),
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    onSameUrlNavigation: 'reload',
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'corrected',
    scrollOffset,
  })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
