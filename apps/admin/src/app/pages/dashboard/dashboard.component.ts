import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import {
  AuthService,
  GetProfileBodyType,
  LoaderService,
} from '@verisure/services';
import {
  CardProductComponent,
  ButtonComponent,
  capitalizeFullName,
} from '@verisure/ui';

@Component({
  selector: 'verisure-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, CardProductComponent, ButtonComponent],
})
export class DashboardComponent implements OnInit {
  activeHover: number | null = null;
  content = [
    {
      id: 1,
      title: 'Maestros del sistema',
      content: 'En esta sección podrás editar las tablas maestras',
      iconUrl: 'assets/icons/maestro-dashboard-icon.svg',
      redirectUrl: '/maestros',
    },
    {
      id: 2,
      title: 'Auditoría',
      content:
        'En esta sección podrás revisar las ofertas realizadas a todos los clientes registrados en el sistema',
      iconUrl: 'assets/icons/auditoria-dashboard-icon.svg',
      redirectUrl: '/auditoria',
    },
    {
      id: 3,
      title: 'Reglas de negocio',
      content: 'En esta sección podrás editar las reglas de negocio',
      iconUrl: 'assets/icons/reglas-dashboard-icon.svg',
      redirectUrl: '/reglas-de-negocios',
    },
    {
      id: 4,
      title: 'Reportería',
      content: 'En esta sección podrás revisar estadísticas del negocio',
      iconUrl: 'assets/icons/reporteria-dashboard-icon.svg',
      redirectUrl: '/reporteria',
    },
  ];

  dataUserLogged!: GetProfileBodyType;
  constructor(
    private authService: AuthService,
    private loaderService: LoaderService,
    private title: Title
  ) {}
  ngOnInit() {
    this.title.setTitle('Dashboard | Admin | Consulta oferta Verisure');
    this.loaderService.show('Cargando Dashboard...');
    this.authService
      .getProfile()
      .then((profile) => {
        this.dataUserLogged = profile;
      })
      .then(() => this.loaderService.hide())
      .catch(() => this.loaderService.hide());
  }

  capitalizeFullName(name: string): string {
    return capitalizeFullName(name ?? '');
  }
  setActiveHover(newValue: number | null) {
    this.activeHover = newValue;
  }
}
