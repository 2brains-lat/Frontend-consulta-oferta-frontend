import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterStateSnapshot } from '@angular/router';
import { AppRoutingModule } from './app.routes.module';
import { MainComponent } from './main.component';
import {
  MsalBroadcastService,
  MsalGuard,
  MsalGuardConfiguration,
  MsalInterceptor,
  MsalInterceptorConfiguration,
  MsalService,
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  ProtectedResourceScopes,
} from '@azure/msal-angular';

import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  BrowserCacheLocation,
  InteractionType,
  IPublicClientApplication,
  LogLevel,
  PublicClientApplication,
} from '@azure/msal-browser';
import { CustomErrorHandler, ErroInterceptor } from '@verisure/services';
import { AppLayoutComponent, LoaderComponent } from '@verisure/ui';
import { environment } from 'environments/environment';
import { LottieModule } from 'ngx-lottie';
import { FormsModule } from '@angular/forms';

export function playerFactory(): any {
  // add this line
  return import('lottie-web'); // add this line
} // add this line

@NgModule({
  declarations: [AppComponent, LoaderComponent, MainComponent],
  imports: [
    CommonModule,
    AppLayoutComponent,
    FormsModule,
    BrowserModule,
    LottieModule.forRoot({ player: playerFactory }),
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [
    BrowserAnimationsModule,
    { provide: ErrorHandler, useClass: CustomErrorHandler },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErroInterceptor,
      multi: true,
    },
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
  bootstrap: [MainComponent],
})
export class AppModule {}

function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.acc_config.clientId,
      redirectUri: environment.acc_config.redirectUri,
      authority: environment.acc_config.authority,
      postLogoutRedirectUri: '/',
      clientCapabilities: ['CP1'],
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
    },
    system: {
      loggerOptions: {
        loggerCallback: (level, message, containsPii) => {
          console.log(message, level, containsPii);
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
      console.log('GUARD CONFIG');
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
