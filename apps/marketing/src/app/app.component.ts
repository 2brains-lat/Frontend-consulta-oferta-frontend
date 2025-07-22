import { Component } from '@angular/core';
import { Event } from '@angular/router';
import { NavLinksContent } from '@verisure/ui/types';
import { AuthService } from '@verisure/services';
import { environment } from 'environments/environment';
import { RoutesNames } from './app.routes.module';
@Component({
  selector: 'verisure-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'marketing';
  links: NavLinksContent = [
    {
      path: RoutesNames.DASHBOARD_ROUTE,
      label: 'Nueva consulta',
      iconUrl: 'assets/icons/nav-nuevaconsulta-icon.svg',
      activeIconUrl: 'assets/icons/nav-nuevaconsulta-negrita.svg',
    },
  ];
  constructor(private authService: AuthService) {
    console.log('AppComponent loaded');
    this.authService.getProfile().then((profile) => {
      console.log('   this.authService.getProfile().then((profile) ', profile);
      if (profile.grupos.includes(environment.id_groups.ventas)) {
        this.links.push({
          path: 'redirect#v1/vta',
          label: 'APP Ventas',
          iconUrl: 'assets/icons/nav-home-icon.svg',
          activeIconUrl: 'assets/icons/nav-home-negrita.svg',
        });
      }
      if (profile.grupos.includes(environment.id_groups.admin)) {
        this.links.push({
          path: 'redirect#v1/admin',
          label: 'APP Admin',
          iconUrl: 'assets/icons/nav-home-icon.svg',
          activeIconUrl: 'assets/icons/nav-home-negrita.svg',
        });
      }
      if (profile.grupos.includes(environment.id_groups.backOffice)) {
        this.links.push({
          path: 'redirect#v1/back-office',
          label: 'APP BackOffice',
          iconUrl: 'assets/icons/nav-home-icon.svg',
          activeIconUrl: 'assets/icons/nav-home-negrita.svg',
        });
      }
    });
  }

  onActivate(event: Event) {
    // window.scroll(0,0);

    document.body.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}
