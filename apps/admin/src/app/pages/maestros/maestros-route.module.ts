import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MaestrosComponent } from './maestros.component';
import { MaestrosOfertaComponent } from './maestros-oferta/maestros-oferta.component';
import { MaestrosSegmentosComponent } from './maestros-segmentos/maestros-segmentos.component';
import { OtrosMaestrosComponent } from './otros-maestros/otros-maestros.component';

const maestrosRoutes: Routes = [
  {
    path: '',
    redirectTo: 'segmento',
    pathMatch: 'full',
  },
  {
    path: '',
    component: MaestrosComponent,
    children: [
      {
        path: 'oferta',
        component: MaestrosOfertaComponent,
      },
      {
        path: 'segmento',
        component: MaestrosSegmentosComponent,
      },
      {
        path: 'otros',
        component: OtrosMaestrosComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [],
  exports: [],
  imports: [CommonModule, RouterModule.forChild(maestrosRoutes)],
})
export class MaestrosRouteModule {}
