import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
// import { NotFoundComponent } from './not-found/not-found.component';
import { MsalGuard, MsalRedirectComponent } from '@azure/msal-angular';

const routes: Routes = [
  {
    path: 'auth',
    component: ProfileComponent,
    canActivate: [MsalGuard],
  },
  {
    path: 'v1/oauth/login',
    component: MsalRedirectComponent,
  },
  {
    path: '',
    component: ProfileComponent,
  },
  // {
  //   path: 'not-found',
  //   component: NotFoundComponent,
  // },
  // {
  //   path: '**',
  //   redirectTo: 'not-found',
  //   pathMatch: 'full',
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
      enableTracing: true,
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
