import { Component, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import {
  AuthenticationResult,
  EventMessage,
  EventType,
  InteractionStatus,
} from '@azure/msal-browser';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '@verisure/services';
import { Router } from '@angular/router';

@Component({
  selector: 'verisure-root',
  template: ` <router-outlet></router-outlet> `,
})
export class MainComponent implements OnInit {
  title = 'admin';
  isAuthenticated = false;
  activeUser: string | undefined = 'unknown user';
  progressAuthState = false;

  private unsubscribe = new Subject<void>();

  constructor(
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.msalBroadcastService.inProgress$.pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      takeUntil(this.unsubscribe)
    );

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (message: EventMessage) =>
            message.eventType === EventType.LOGIN_SUCCESS
        ),
        takeUntil(this.unsubscribe)
      )
      .subscribe((message: EventMessage) => {
        console.log('AUTH');
        const authResult = message.payload as AuthenticationResult;
        this.msalService.instance.setActiveAccount(authResult.account);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(undefined);
    this.unsubscribe.complete();
    this.progressAuthState = false;
  }

  login(): void {
    this.msalService.loginRedirect({
      scopes: ['user.read'],
    });
  }

  logout(): void {
    this.progressAuthState = false;
    this.authService.logOut();
  }

  async setAuthenticationStatus() {
    const activeAccount = this.msalService.instance.getActiveAccount();
    const tokenResponse = await this.msalService
      .acquireTokenSilent({
        scopes: ['user.read'],
        account: activeAccount ?? undefined,
      })
      .toPromise();
  }
}
