import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthPermissionGuard implements CanActivate {
  constructor(
    private msalService: MsalService,
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Promise<boolean> | boolean {
    const roles = route.data['allowedRoles'];
    return setAuthenticationStatus(this.msalService, this.authService).then(
      (currentUsersRoles) => {
        if (currentUsersRoles && currentUsersRoles.length > 0) {
          for (const role of roles) {
            if (currentUsersRoles.includes(role)) {
              return true;
            }
          }
        }
        this.router.navigate(['acc-without-authorization']);
        return false;
      }
    );
  }
}
const setAuthenticationStatus = async (
  msalService: MsalService,
  authService: AuthService
) => {
  let activeAccount = msalService.instance.getActiveAccount();
  const tokenResponse = await msalService
    .acquireTokenSilent({
      scopes: ['user.read'],
      account: activeAccount ?? undefined,
    })
    .toPromise();
  if (!activeAccount && msalService.instance.getAllAccounts().length > 0) {
    activeAccount = msalService.instance.getActiveAccount();
    msalService.instance.setActiveAccount(activeAccount);
  }
  if (tokenResponse && activeAccount) {
    // redirect(basicUserInfo?.idGroup);
    const myGroups = (await authService.getProfile()).grupos;
    return myGroups;
  }
  return [];
};
