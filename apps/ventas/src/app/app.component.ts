import { Component } from '@angular/core';
import { Event } from '@angular/router';
import { AuthService } from '@verisure/services';
import { environment } from 'environments/environment';
@Component({
  selector: 'verisure-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ventas';
  links = [
    {
      path: 'panel#consulta',
      label: 'Nueva consulta',
      iconUrl: 'assets/icons/nav-nuevaconsulta-icon.svg',
      activeIconUrl: 'assets/icons/nav-nuevaconsulta-negrita.svg',
    },
    {
      path: 'panel#historial',
      label: 'Historial de clientes',
      iconUrl: 'assets/icons/nav-historial-icon.svg',
      activeIconUrl: 'assets/icons/nav-historial-negrita.svg',
    },
  ];
  constructor(private authService: AuthService) {
    console.log('appComponent constructor on ');
    this.authService.getProfile().then((profile) => {
      console.log('profiles ', profile);
      if (profile.grupos.includes(environment.id_groups.marketing)) {
        this.links.push({
          path: 'redirect#v1/mkt',
          label: 'APP Marketing',
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
