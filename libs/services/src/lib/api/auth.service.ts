import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { MsalService } from '@azure/msal-angular';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { getCache, createCache } from './utils';

interface grouposT {
  value: { id: string }[];
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public headerData!: Promise<{
    'Content-Type': string;
    Authorization: string;

  }>;
  public currentAuthToken: Promise<string> = this.msalService
    .acquireTokenSilent({
      scopes: ['user.read'],
      account: this.msalService.instance.getActiveAccount() ?? undefined,
    })
    .toPromise()
    .then((secret) => secret?.accessToken ?? '');
  currentProfile!: Promise<GetProfileBodyType>;
  constructor(private http: HttpClient, private msalService: MsalService) {}
  getProfileCache(): Promise<GetProfileBodyType> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      const cache = getCache('getProfile');
      if (cache) {
        resolve(cache);
      } else {
        this.getProfile().then((e) => resolve(e));
      }
    });
  }
  getProfile(): Promise<GetProfileBodyType> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      this.http
        .post<GetProfileBodyType>(
          environment.apigateway_url + '/auth',
          { token: await this.currentAuthToken },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              'Cache-Control': 'no-store, no-cache, must-revalidate',
              
              Authorization: 'Bearer ' + (await this.currentAuthToken),
            },
          }
        )
        .subscribe((profile) => {
          createCache('getProfile', profile, 0);
          resolve(profile);
        });
    });
  }
  getMemberOf(): Promise<string[]> {    
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      this.http
        .get(`${environment.graph_endpoint}/memberOf`, {
          // headers: await this.headerData,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            
            Authorization: 'Bearer ' + (await this.currentAuthToken),
          },
        })
        .subscribe((groups: any) => {
          resolve(
            groups?.value.map((value: { id: string }) => value.id.toString())
          );
        });
    });
  }

  logOut(): void {
    // eliminar codigo de cache de TOKENS
    localStorage.clear();
    sessionStorage.clear();
    // localStorage.removeItem('messageLoading');
    this.msalService.logoutRedirect();
  }
  login(): void {
    // localStorage.clear();
    // sessionStorage.clear();
    const loginRequest = {
      prompt: 'select_account', // Prompt the user to select an account
      scopes: ['user.read'], // Define the required scopes for your application
    };
    this.msalService.loginPopup(loginRequest).subscribe({
      next: (response: any) => {
        // Handle the successful login response       this.msalService.instance.setActiveAccount(activeAccount);
        const activeAccount = this.msalService.instance.getAccountByHomeId(
          response.account.homeAccountId
        );
        this.msalService.instance.setActiveAccount(activeAccount);
        window.location.href = '/';
      },
      error: (error) => {
        // Handle any errors that occurred during login
        console.log('An error occurred during login:', error);
      },
    });
  }
  reLogin(): void {
    localStorage.clear();
    const activeAccount = this.msalService.instance.getAllAccounts();
    if (activeAccount.length > 0) {
      console.log('active account1 ', activeAccount[0]);
      this.msalService.instance.setActiveAccount(activeAccount[0]);
      window.location.href = '/';
    }
  }
}

export type GetProfileBodyType = {
  email: string;
  delegacion: string;
  matricula: string;
  grupos: string[];
  centroCosto: string;
  cargo: string;
  nombreCompleto: string;
};
