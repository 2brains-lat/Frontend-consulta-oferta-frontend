import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ProfileComponent } from './profile/profile.component';

import {
  MsalBroadcastService,
  MsalGuard,
  MsalGuardConfiguration,
  MsalInterceptor,
  MsalInterceptorConfiguration,
  MsalRedirectComponent,
  MsalService,
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  ProtectedResourceScopes,
} from '@azure/msal-angular';
import {
  BrowserCacheLocation,
  InteractionType,
  IPublicClientApplication,
  LogLevel,
  PublicClientApplication,
} from '@azure/msal-browser';
import { RouterModule, RouterStateSnapshot } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'environments/environment';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loading/loading.component';
import { LottieModule } from 'ngx-lottie';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

export function playerFactory(): any {
  // add this line
  return import('lottie-web'); // add this line
} // add this line

@NgModule({
  declarations: [AppComponent, ProfileComponent, LoaderComponent],
  imports: [
    CommonModule,
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LottieModule.forRoot({ player: playerFactory }), // add this line
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.acc_config.production,
    }),
    FormsModule,
  ],
  providers: [
    BrowserAnimationsModule,
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MsalGuardConfigFactory,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MsalInterceptorConfigFactory,
    },
    MsalService,
    MsalBroadcastService,
    MsalGuard,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}

function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.acc_config.clientId,
      redirectUri: environment.acc_config.redirectUri,
      authority: environment.acc_config.authority,
      postLogoutRedirectUri: '/',
      // clientCapabilities: ['CP1'],
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
    },
    system: {
      loggerOptions: {
        loggerCallback: (level, message, containsPii) => {
          console.log(message);
        },
        logLevel: LogLevel.Verbose,
      },
    },
  });
}

function MsalGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: (authService: MsalService, state: RouterStateSnapshot) => {
      return {
        scopes: ['user.read'],
        loginHint: state.root.queryParams['userId'] || undefined,
      };
    },
  };
}

function MsalInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const myProtectedResourceMap = new Map<
    string,
    Array<string | ProtectedResourceScopes> | null
  >();

  myProtectedResourceMap.set('https://graph.microsoft.com/v1.0/me', [
    {
      httpMethod: 'GET',
      scopes: ['user.read'],
    },
  ]);

  return {
    interactionType: InteractionType.Popup,
    protectedResourceMap: myProtectedResourceMap,
    authRequest: (msalService, httpReq, originalAuthRequest) => {
      return {
        ...originalAuthRequest,
        claims: localStorage.getItem('claimsChallenge')
          ? window.atob(localStorage.getItem('claimsChallenge') as string)
          : undefined,
      };
    },
  };
}
