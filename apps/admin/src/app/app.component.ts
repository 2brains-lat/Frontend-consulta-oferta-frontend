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
  title = 'admin';
  links: NavLinksContent = [
    {
      path: RoutesNames.DASHBOARD_ROUTE,
      label: 'Inicio',
      iconUrl: 'assets/icons/nav-home-icon.svg',
      activeIconUrl: 'assets/icons/nav-home-negrita.svg',
    },
    {
      path: '',
      label: 'Maestros del sistema',
      iconUrl: 'assets/icons/nav-maestros-icon.svg',
      activeIconUrl: 'assets/icons/nav-maestros-negrita.svg',
      subMenu: [
        {
          path: 'maestros/oferta',
          label: 'Maestro oferta',
        },
        {
          path: 'maestros/segmento',
          label: 'Maestro segmentos',
        },
      ],
    },
    {
      path: 'reglas-de-negocios',
      label: 'Reglas de negocio',
      iconUrl: 'assets/icons/nav-reglas-icon.svg',
      activeIconUrl: 'assets/icons/nav-reglas-negrita.svg',
    },
    {
      path: 'auditoria',
      label: 'Auditoría',
      iconUrl: 'assets/icons/nav-auditoria-icon.svg',
      activeIconUrl: 'assets/icons/nav-auditoria-negrita.svg',
    },
    {
      path: 'reporteria',
      label: 'Reportería',
      iconUrl: 'assets/icons/nav-reporteria-icon.svg',
      activeIconUrl: 'assets/icons/nav-reporteria-negrita.svg',
    },
  ];
  constructor(private authService: AuthService) {
    this.authService.getProfile().then((profile) => {
      if (profile.grupos.includes(environment.id_groups.ventas)) {
        this.links.push({
          path: 'redirect#v1/vta',
          label: 'APP Ventas',
          iconUrl: 'assets/icons/nav-home-icon.svg',
          activeIconUrl: 'assets/icons/nav-home-negrita.svg',
        });
      }
      if (profile.grupos.includes(environment.id_groups.marketing)) {
        this.links.push({
          path: 'redirect#v1/mkt',
          label: 'APP Marketing',
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
