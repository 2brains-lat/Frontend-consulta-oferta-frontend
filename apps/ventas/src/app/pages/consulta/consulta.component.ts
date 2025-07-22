/* eslint-disable no-constant-condition */
import { Component, OnInit } from '@angular/core';

import {
  ConsultarutContainerComponent,
  formatFormReqItem,
  FormConsultarutComponent,
  rutValidator,
  TabComponent,
  HistoryComponent,
} from '@verisure/ui';
import { CommonModule } from '@angular/common';
import {
  AuthService,
  ConsultaOfertaService,
  GetProfileBodyType,
  LoaderService,
  TipoClienteDto,
  TipoInmuebleDto,
} from '@verisure/services';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { environment } from 'environments/environment';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'verisure-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss'],
  imports: [
    CommonModule,
    ConsultarutContainerComponent,
    FormConsultarutComponent,
    TabComponent,
    HistoryComponent,
  ],
  standalone: true,
})
export class ConsultaComponent implements OnInit {
  get onChange() {
    return this._onChange;
  }
  set onChange(value: 'consulta' | 'historial' | string) {
    value === 'consulta'
      ? this.titleHead.setTitle('Dashboard | Ventas | Consulta oferta Verisure')
      : this.titleHead.setTitle(
          'Historial | Ventas | Consulta oferta Verisure'
        );
    this._onChange = value;
  }
  _onChange: 'consulta' | 'historial' | string = 'consulta';
  form: FormGroup;
  formHistory!: FormGroup;
  dataUser!: GetProfileBodyType;
  errorMessage: any;
  segmentoDb!: TipoClienteDto[];
  tabItems = [
    { value: 'consulta', label: 'Nueva consulta' },
    { value: 'historial', label: 'Historial de clientes' },
  ];
  segmentos!: { label: string; value: string; disabled?: boolean }[];
  recurso!: { label: string; value: string }[];

  inmuebles!: TipoInmuebleDto[];
  inmuebleShowing!: { key: string; value: string }[];
  statusChangeInmuebles = 0;

  /* ------------------------------------------------------- */

  /* ------------------------------------------------------- */
  constructor(
    public consultaService: ConsultaOfertaService,
    private router: Router,
    private route: ActivatedRoute,
    public fb: FormBuilder,
    private loaderService: LoaderService,
    private authService: AuthService,
    private titleHead: Title
  ) {
    this.titleHead.setTitle('Dashboard | Ventas | Consulta oferta Verisure');

    this.form = fb.group({
      // field1: ['', [Validators.required]],
      rut: ['', [Validators.required, rutValidator()]],
      segmento: ['', [Validators.required]],
      recurso: ['', [Validators.required]],
      inmueble: [null, [Validators.required]],
      prospecto: ['', [Validators.required]],
    });
  }

  async ngOnInit() {
    // **************** CONSULTING OFFER BY RUT ***********************************

    this.loaderService.show(
      'Te redirigiremos a consulta oferta, por favor espera un momento'
    );
    await this.setFormVar();
    //ROUTE FRAGMENT / QUERY PARAMS
    this.tabNavigationByFragment();
    this.completeFormByQueryParams();
    // SET DEFAULT on change event
    this.formOnChangeEvents();
    this.loaderService.hide();
    // *************************** END  ************************
  }

  refreshInmuebles(value: string | number) {
    this.statusChangeInmuebles = 0;
    this.inmuebleShowing = this.getInmueblesBySegmento(value?.toString()) ?? [];

    setTimeout(() => (this.statusChangeInmuebles = 1), 100);
  }

  getInmueblesBySegmento(segmentoKey: string) {
    const _segmentos = this.segmentoDb;
    const _key =
      getElementFromIdVerisure(_segmentos ?? [], segmentoKey?.toString())
        ?.tipoClienteId ?? '';
    if (this.inmuebles === undefined) return;
    const inmueblesBySegmento = this.inmuebles
      .filter(
        (inmueble) => inmueble.tipoClienteId.toString() === _key.toString()
      )
      .map((inmbl) => ({
        key: inmbl.verisureId.toString(),
        value: inmbl.glosa,
      }));

    this.form.controls['inmueble'].setValidators([
      Validators.required,
      // valida
      ValidatorKeys(inmueblesBySegmento.map((inmueble) => inmueble.key)),
    ]);
    return inmueblesBySegmento;
  }
  // METODO DUMMIE PARA CONSULTAR ENDPOINT BACKEND
  async onSubmit() {
    console.log('ON SUBMIT');

    this.loaderService.show('Consultando oferta,  por favor espera un momento');

    const [segmentos, recursos, inmuebles] = await Promise.all([
      this.consultaService.getSegmentos(),
      this.consultaService.getRecursos(),
      this.consultaService.getInmuebles(),
    ]).catch(() => {
      this.loaderService.hide();
      return [];
    });

    const sendContent = formatFormReqItem({
      form: this.form.value,
      inmuebles,
      recursos,
      segmentos,
    });

    this.consultaService.postNewConsulting(sendContent).then((data) => {
      const idPath = btoa(data.id);
      this.router.navigate(['oferta/' + idPath]);
      this.loaderService.hide();
    });
  }
  async setFormVar() {
    const [segmentos, recursos, inmuebles, profile] = await Promise.all([
      this.consultaService.getSegmentos(),
      this.consultaService.getRecursos(),
      this.consultaService.getInmuebles(),
      this.authService.getProfile(),
    ]);

    this.dataUser = profile;

    if (
      (!inmuebles && inmuebles === null) ||
      (!segmentos && segmentos === null) ||
      (!recursos && recursos === null)
    ) {
      this.router?.navigate(['server-error']);
      return;
    }
    const inmueblesBd = inmuebles;

    this.segmentoDb = segmentos;
    this.segmentos = [
      ...segmentos.map((segmento) => ({
        label: segmento.glosa,
        value: segmento.verisureId.toString(),
      })),
    ];

    this.recurso = recursos.map((recurso) => ({
      label: recurso.glosa,
      value: recurso.verisureId.toString(),
    }));

    this.inmuebles = inmueblesBd;
  }
  completeFormByQueryParams() {
    this.route.queryParamMap.subscribe((data) => {
      if (data.keys.length <= 0) return;
      data.keys.forEach((key) => {
        if (key === 'inmueble') {
          this.form.get(key)?.setValue(data.get(key)?.toString());
          return;
        }
        if (key === 'segmento') {
          this.refreshInmuebles(data.get(key)?.toString() ?? '');
        }
        this.form.get(key)?.setValue(data.get(key));
      });
    });
  }
  tabNavigationByFragment() {
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        const tabs = this.tabItems.map((values) => values.value);
        if (tabs.includes(fragment)) {
          this.onChange = fragment;
        }
      }
    });
  }
  formOnChangeEvents() {
    this.form.get('recurso')?.valueChanges.subscribe((value) => {
      const requiredStatus =
        JSON.parse(environment.form.prospecto_rp)?.verisureId ==
        value.toString()
          ? JSON.parse(environment.form.prospecto_rp)?.requiredStatus
          : JSON.parse(environment.form.prospecto_re)?.verisureId ==
            value.toString()
          ? JSON.parse(environment.form.prospecto_re)?.requiredStatus
          : false;
      this.form.controls['prospecto'].setValidators(
        requiredStatus ? Validators.required : null
      );
    });
    this.form.get('segmento')?.valueChanges.subscribe((value) => {
      this.form.controls['inmueble'].setValue(null);
      this.refreshInmuebles(value);
    });
  }

  /* ----- ABRIR MENU DE FILTROS DE HISTORIAL ----- */
  openFilterMenuHistory(event: any) {
    console.log('Event from historial, toggle menu filter: ', event);
  }
  /* ---------------------------------------------- */
}

function getElementFromIdVerisure(
  array: { verisureId: string; tipoClienteId?: number }[],
  idVerisure: string
): { verisureId: string; tipoClienteId?: number } | null {
  return array.find((e) => e?.verisureId === idVerisure) ?? null;
}

function ValidatorKeys(nameRe: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = nameRe.includes(control.value?.toString());
    return forbidden ? null : { customError: 'Ingrese un valor valido' };
  };
}
