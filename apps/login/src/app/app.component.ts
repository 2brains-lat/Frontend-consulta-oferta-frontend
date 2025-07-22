import { Component, OnDestroy, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import {
  AuthenticationResult,
  EventMessage,
  EventType,
  InteractionStatus,
} from '@azure/msal-browser';
import { filter, takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { environment } from 'environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'msal-angular demo';
  isAuthenticated = false;
  activeUser: string | undefined = 'unknown user';
  progressAuthState = false;
  isLoading = false;
  version = environment.app_version;
  private unsubscribe = new Subject<void>();

  constructor(
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.msalBroadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        takeUntil(this.unsubscribe)
      )
      .subscribe(() => {
        this.isLoading = true;

        this.setAuthenticationStatus()
          .then(() => {
            this.progressAuthState = true;
            localStorage.removeItem('loadedByCache');
          })
          .finally(() => (this.isLoading = false));
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
        this.isLoading = true;
        const authResult = message.payload as AuthenticationResult;
        this.msalService.instance.setActiveAccount(authResult.account);
      });

    this.checkCache();
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

    localStorage.removeItem('loadedByCache');
    this.msalService.logoutRedirect();
  }

  checkCache(): void {
    /**
    - solo si tengo cache de una sesion activa volvera o intentara logearse,
    - si deslogeamos y ya no existe cache de sesion, entonces este no volvera a intentar logearse. 
    Esto para prevenir que cada vez que cerremos el navegador o apagemos la pc tengamos que volver a logear.
    **/
    setTimeout(() => {
      if (
        (localStorage.getItem('loadedByCache') === undefined ||
          localStorage.getItem('loadedByCache') === null) &&
        !this.progressAuthState &&
        !this.isAuthenticated &&
        this.msalService.instance.getAllAccounts().length == 0
      ) {
        localStorage.setItem('loadedByCache', 'true');
        this.login();
      }
    }, 100);
  }

  async setAuthenticationStatus() {
    let activeAccount = this.msalService.instance.getActiveAccount();
    const tokenResponse = await this.msalService
      .acquireTokenSilent({
        scopes: ['user.read'],
        account: activeAccount ?? undefined,
      })
      .toPromise();

    if (
      !activeAccount &&
      this.msalService.instance.getAllAccounts().length > 0
    ) {
      console.log(tokenResponse);
      activeAccount = this.msalService.instance.getActiveAccount();
      this.msalService.instance.setActiveAccount(activeAccount);
    }

    this.isAuthenticated = activeAccount ? true : false;
    this.activeUser = activeAccount?.username;

    if (tokenResponse && activeAccount) {
      const headerData = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + tokenResponse.accessToken, // IMPORTANTE , DEBO OBTENER EL SECRET TOKEN
      });
      // await this.http
      //   .get(`${environment.graph_endpoint}/memberOf`, {
      //     headers: headerData,
      //   })
      //   .toPromise()
      //   .then((req: any) => {
      //     console.log("--------------memberOf-------------");
      //     console.log(req)
      //     const groups = req?.value.map((value: { id: any }) => value.id);
      //     redirect(groups ?? ['']);
      //   });

      this.recursiveMemberOf(`${environment.graph_endpoint}/memberOf?$top=100`, headerData, [], redirect);
    } else {
      localStorage.clear();
    }
  }

  recursiveMemberOf (url: string, headerData: any, groups: Array<any> , cb: Function) {
    console.log('Recursive member of');
    this.http
          .get(url, {
            headers: headerData,
          })
          .toPromise()
          .then((req: any) => {
            console.log("--------------memberOf-------------");
            console.log(req)
            const data = req?.value.map((value: { id: any }) => value.id);
            groups = [...groups, ...data];

            if(req["@odata.nextLink"]) {
              this.recursiveMemberOf(req["@odata.nextLink"], headerData, groups, cb);
            } else {              
              cb(groups ?? ['']);
            }
          });
  }
}



const redirect = (idGroup: string[]) => {
  if (
    idGroup.includes(environment.id_groups.admin) 
  ) {
    window.location.href = '/v1/admin/';
    return;
  }
  if (idGroup.includes(environment.id_groups.ventas)) {
    window.location.href = '/v1/vta/panel/';
    return;
  }
  if (idGroup.includes(environment.id_groups.marketing)) {
    window.location.href = '/v1/mkt/';
    return;
  }

  if (idGroup.includes(environment.id_groups.backOffice)) {
    window.location.href = '/v1/back-office/';
    return;
  }
  window.location.href = '/v1/vta/acc-without-authorization';
};
