import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { MsalGuard } from '@azure/msal-angular';
import { AuthPermissionGuard } from '@verisure/services';
import { environment } from 'environments/environment';
import { AppComponent } from './app.component';

export const RoutesNames = {
  PANEL_ROUTE: 'panel',
  OFFER_ROUTE: 'oferta',
  SUCCESSFUL_DOWNLOAD_ROUTE: 'successful-download',
  FAILED_DOWNLOAD_ROUTE: 'failed-download',
  REDIRECT_ROUTE: 'redirect',
  NOT_FOUND_ROUTE: 'not-found',
  SERVER_ERROR_ROUTE: 'server-error',
  OPPS_ROUTE: 'Opps',
  UNAUTHORIZED_ERROR_ROUTE: 'unauthorized-error',
  ACC_WITHOUT_AUTHORIZATION: 'acc-without-authorization',
};
export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: RoutesNames.PANEL_ROUTE,
    pathMatch: 'full',
  },
  {
    path: '',
    component: AppComponent,
    canActivate: [MsalGuard, AuthPermissionGuard],
    data: {
      allowedRoles: [environment.id_groups.ventas],
    },
    children: [
      {
        path: RoutesNames.PANEL_ROUTE,
        // component: ConsultaComponent,
        loadComponent: () =>
          import('./pages/consulta/consulta.component').then(
            (m) => m.ConsultaComponent
          ),
      },
      {
        path: RoutesNames.OFFER_ROUTE + '/:id',
        // component: ResultadoconsultaComponent,
        loadComponent: () =>
          import('./pages/resultadoconsulta/resultadoconsulta.component').then(
            (m) => m.ResultadoconsultaComponent
          ),
      },
    ],
  },

  {
    path: RoutesNames.FAILED_DOWNLOAD_ROUTE,
    // component: FaileddownloadComponent,
    loadComponent: () =>
      import('./pages/faileddownload/faileddownload.component').then(
        (m) => m.FaileddownloadComponent
      ),
  },
  {
    path: RoutesNames.REDIRECT_ROUTE,
    // component: RedirectComponent,
    loadComponent: () =>
      import('./pages/redirect/redirect.component').then(
        (m) => m.RedirectComponent
      ),
  },
  {
    path: RoutesNames.SUCCESSFUL_DOWNLOAD_ROUTE,
    // component: SuccessfuldownloadComponent,
    loadComponent: () =>
      import('./pages/successfuldownload/successfuldownload.component').then(
        (m) => m.SuccessfuldownloadComponent
      ),
  },

  {
    path: RoutesNames.NOT_FOUND_ROUTE,
    // component: NotFoundComponent,
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
  {
    path: RoutesNames.SERVER_ERROR_ROUTE,
    // component: ServerErrorComponent,
    loadComponent: () =>
      import('./pages/server-error/server-error.component').then(
        (m) => m.ServerErrorComponent
      ),
  },
  {
    path: RoutesNames.OPPS_ROUTE,
    // component: OopsComponent,
    loadComponent: () =>
      import('./pages/oops/oops.component').then((m) => m.OopsComponent),
  },
  {
    path: RoutesNames.UNAUTHORIZED_ERROR_ROUTE,
    // component: UnauthorizedComponent,
    loadComponent: () =>
      import('./pages/unauthorized/unauthorized.component').then(
        (m) => m.UnauthorizedComponent
      ),
  },
  {
    path: RoutesNames.ACC_WITHOUT_AUTHORIZATION,
    // component: accWithoutIdGroupComponent,
    loadComponent: () =>
      import('./pages/accWithoutIdGroup/accwithoutidgroup.component').then(
        (m) => m.accWithoutIdGroupComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full',
  },
];

// configures NgModule imports and exports
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      initialNavigation: 'enabledBlocking',
      enableTracing: true,
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
