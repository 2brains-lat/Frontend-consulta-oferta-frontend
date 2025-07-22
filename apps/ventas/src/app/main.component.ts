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
import { environment } from 'environments/environment';
import { AuthService } from '@verisure/services';
import { Router } from '@angular/router';

@Component({
  selector: 'verisure-root',
  template: ` <router-outlet></router-outlet> `,
})
export class MainComponent implements OnInit {
  title = 'ventas';
  isAuthenticated = false;
  activeUser: string | undefined = 'unknown user';
  progressAuthState = false;

  private unsubscribe = new Subject<void>();

  constructor(
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private authService: AuthService,
    private router: Router
  ) {
    console.log('MAIN component constructor ON');
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    this.msalBroadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        takeUntil(this.unsubscribe)
      )
      .subscribe(() => {
        console.log('FORMATING AUTH DATA');
        this.setAuthenticationStatus().then(() => {
          this.progressAuthState = true;
          localStorage.removeItem('loadedByCache');
        });
      });

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
    console.log('activeAccount', activeAccount);
    const tokenResponse = await this.msalService
      .acquireTokenSilent({
        scopes: ['user.read'],
        account: activeAccount ?? undefined,
      })
      .toPromise();

    // if (
    //   !activeAccount &&
    //   this.msalService.instance.getAllAccounts().length > 0
    // ) {
    //   activeAccount = this.msalService.instance.getAllAccounts()[0];
    //   this.msalService.instance.setActiveAccount(activeAccount);
    // }

    // this.isAuthenticated = activeAccount ? true : false;
    // this.activeUser = activeAccount?.username;

    // if (tokenResponse && activeAccount) {
    //   // redirect(basicUserInfo?.idGroup);
    //   const myGroups = (await this.authService.getProfile()).grupos;
    //   myGroups.includes(environment.id_groups.admin)
    //     ? null
    //     : this.router.navigate(['unauthorized-error']);
    // }
  }
}
