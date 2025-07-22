import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { MsalGuard } from '@azure/msal-angular';
import { AuthPermissionGuard } from '@verisure/services';
import { environment } from 'environments/environment';
import { AppComponent } from './app.component';
import { AuditoriaComponent } from './pages/auditoria/auditoria.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

import { ReporteriaComponent } from './pages/reporteria/reporteria.component';

export const RoutesNames = {
  MASTER_ROUTE: 'maestros',
  BUSSINESS_RULES_ROUTE: 'reglas-de-negocios',
  AUDIT_ROUTE: 'auditoria',
  REPORTING_ROUTE: 'reporteria',
  DASHBOARD_ROUTE: 'dashboard',
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
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AppComponent,
    canActivate: [MsalGuard, AuthPermissionGuard],
    data: {
      allowedRoles: [environment.id_groups.backOffice],
    },
    children: [
      {
        path: RoutesNames.DASHBOARD_ROUTE,
        component: DashboardComponent,
      },
      {
        path: RoutesNames.AUDIT_ROUTE,
        component: AuditoriaComponent,
      },
      {
        path: RoutesNames.REPORTING_ROUTE,
        component: ReporteriaComponent,
      },
    ],
  },
  {
    path: RoutesNames.REDIRECT_ROUTE,
    loadComponent: () =>
      import('./pages/redirect/redirect.component').then(
        (m) => m.RedirectComponent
      ),
  },

  {
    path: RoutesNames.NOT_FOUND_ROUTE,
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
  {
    path: RoutesNames.SERVER_ERROR_ROUTE,
    loadComponent: () =>
      import('./pages/server-error/server-error.component').then(
        (m) => m.ServerErrorComponent
      ),
  },
  {
    path: RoutesNames.OPPS_ROUTE,
    loadComponent: () =>
      import('./pages/oops/oops.component').then((m) => m.OopsComponent),
  },
  {
    path: RoutesNames.UNAUTHORIZED_ERROR_ROUTE,
    loadComponent: () =>
      import('./pages/unauthorized/unauthorized.component').then(
        (m) => m.UnauthorizedComponent
      ),
  },
  {
    path: RoutesNames.ACC_WITHOUT_AUTHORIZATION,
    loadComponent: () =>
      import('./pages/accWithoutIdGroup/accwithoutidgroup.component').then(
        (m) => m.accWithoutIdGroupComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full',
  }
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
