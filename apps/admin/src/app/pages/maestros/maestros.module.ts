import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaestrosComponent } from './maestros.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import {
  AlertComponent,
  ButtonComponent,
  InputComponent,
  MaestrosLayoutComponent,
  SearchbarListAdminComponent,
  TabComponent,
  TableListAdminComponent,
  VerisureBadgeModule,
  VerisureMultipleCheckboxModule,
  VerisureTableModule,
  RadioButtonComponent,
} from '@verisure/ui';
import { MaestrosOfertaComponent } from './maestros-oferta/maestros-oferta.component';
import { MaestrosRouteModule } from './maestros-route.module';
import { RouterModule } from '@angular/router';
import { MaestrosSegmentosComponent } from './maestros-segmentos/maestros-segmentos.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MaestroProductoComponent } from './maestros-oferta/maestro-producto/maestro-producto.component';
import { MaestroPrecioComponent } from './maestros-oferta/maestro-precio/maestro-precio.component';
import { MaestroCondicionesComponent } from './maestros-oferta/maestro-condiciones/maestro-condiciones.component';
import { OtrosMaestrosComponent } from './otros-maestros/otros-maestros.component';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { DialogProductoComponent } from './maestros-oferta/maestro-producto/dialog-producto/dialog-producto.component';
import { DialogPrecioComponent } from './maestros-oferta/maestro-precio/dialog-precio/dialog-precio.component';
import { DialogCondicionComponent } from './maestros-oferta/maestro-condiciones/dialog-condicion/dialog-condicion.component';
import { DialogSegmentsComponent } from './maestros-segmentos/dialog-segmentos/dialog-segmentos.component';

@NgModule({
  declarations: [
    MaestrosComponent,
    MaestrosOfertaComponent,
    MaestroProductoComponent,
    MaestroPrecioComponent,
    MaestroCondicionesComponent,
    MaestrosSegmentosComponent,
    OtrosMaestrosComponent,
    DialogProductoComponent,
    DialogPrecioComponent,
    DialogCondicionComponent,
    DialogSegmentsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    ReactiveFormsModule,
    MatSidenavModule,
    MaestrosLayoutComponent,
    TabComponent,
    InputComponent,
    ButtonComponent,
    RadioButtonComponent,
    SearchbarListAdminComponent,
    TableListAdminComponent,
    MaestrosRouteModule,
    VerisureTableModule,
    AlertComponent,

    MatSlideToggleModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,

    VerisureBadgeModule,
    VerisureMultipleCheckboxModule,
  ],
  exports: [MatDialogContent, MatDialogActions],
  entryComponents: [
    DialogProductoComponent,
    DialogPrecioComponent,
    DialogCondicionComponent,
    DialogSegmentsComponent,
  ],
})
export class MaestrosModule {}
