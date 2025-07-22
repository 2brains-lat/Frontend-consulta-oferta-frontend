import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Route, Router, RouterModule } from '@angular/router';
import {
  AuthService,
  GetProfileBodyType,
  LoaderService,
  MarketingService,
  ComunasType,
  ConsultaOfertaService,
} from '@verisure/services';
import {
  CardProductComponent,
  ButtonComponent,
  capitalizeFullName,
  TabComponent,
  rutValidator,
  FormMarketingComponent,
} from '@verisure/ui';
import { environment } from 'environments/environment';
import { RoutesNames } from '../../app.routes.module';
import { formatearRut } from '../../../../../../libs/ui/src/lib/common-ui/features/offers-to-offer/utils';

@Component({
  selector: 'verisure-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardProductComponent,
    TabComponent,
    ButtonComponent,
    FormMarketingComponent,
  ],
})
export class DashboardComponent implements OnInit {
  onChange = 'consulta';
  form: FormGroup;
  activeHover: number | null = null;
  tipoCliente: { label: string; value: string | number }[] = [
    {
      label: 'Residencial',
      value: 0,
    },
    {
      label: 'Negocio',
      value: 1,
    },
  ];
  comunas!: { value: string; label: string }[];
  tabItems = [{ value: 'consulta', label: 'Nueva consulta' }];
  dataUserLogged!: GetProfileBodyType;
  constructor(
    private authService: AuthService,
    private loaderService: LoaderService,
    public fb: FormBuilder,
    private marketingService: MarketingService,
    private router: Router,
    private titleHead: Title,
    private consultaService: ConsultaOfertaService
  ) {
    this.titleHead.setTitle('Dashboard | Marketing | Consulta oferta Verisure');
    this.form = fb.group({
      // field1: ['', [Validators.required]],
      rut: ['', [Validators.required, rutValidator()]],
      tipoCliente: [null, [Validators.required]],
      idComuna: [null, [Validators.required]],
    });
  }
  ngOnInit() {
    this.loaderService.show('Cargando Dashboard...');

    Promise.all([
      this.marketingService.getComunas(),
      this.authService.getProfile(),
      this.consultaService.getSegmentos(),
    ])
      .then((res) => {
        const [comunas, profile, segmentos] = res;
        console.log(comunas);
        if (
          (!comunas && comunas === null) ||
          (!segmentos && segmentos === null) ||
          (!profile && profile === null)
        ) {
          this.router?.navigate(['server-error']);
          return;
        }
        this.comunas = (comunas as ComunasType[]).map((e) => ({
          value: e.id,
          label: e.glosa,
        }));
        this.tipoCliente = [
          ...segmentos.map((segmento) => ({
            label: segmento.glosa,
            value: segmento.verisureId.toString(),
          })),
        ];
        this.dataUserLogged = profile;
      })
      .then(() => this.loaderService.hide())
      .catch(() => this.loaderService.hide());
  }
  submit() {
    this.loaderService.show('Redireccionando a la consulta...');
    const values = this.form.value;
    const form = {
      rut: values.rut,
      tipoCliente:
        this.tipoCliente.find((e) => e.value === values.tipoCliente)?.label ??
        '',
      idComuna:
        this.comunas.find((e) => e.value === values.idComuna)?.label ?? '',
      zonaCobertura: true,
    };
    console.log(form);
    this.marketingService.postNewConsulting(form).then((e) => {
      setTimeout(() => {
        const idPath = btoa(e.id);
        this.router.navigate([RoutesNames.STRATEGY_ROUTE + '/' + idPath]);
        this.loaderService.hide();
      }, 300);
    });
  }

  capitalizeFullName(name: string): string {
    return capitalizeFullName(name);
  }
  setActiveHover(newValue: number | null) {
    this.activeHover = newValue;
  }
}
