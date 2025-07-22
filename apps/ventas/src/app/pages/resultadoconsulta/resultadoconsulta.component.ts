import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  AuthService,
  ConsultaOfertaService,
  LoaderService,
  RequestStatusAlertService,
} from '@verisure/services';
import {
  BreadcrumbComponent,
  ButtonComponent,
  CommonsComponentsComponent,
  NextStepComponent,
  ResultadoconsultaLayoutComponent,
  ScreenDescuentosComponent,
  ScreenKitinicialComponent,
  ScreenPacksComponent,
  ScreenResumenComponent,
  TabComponent,
} from '@verisure/ui';
import {
  productsBaseT,
  DetalleOfferT,
  ResumenT,
  offerT,
  productListT,
  offerResponseStatus,
  asyncCallParamsT,
  offerModeStatus,
} from '@verisure/ui/types';
import { breadcrumbsItemsDefaultValues } from './utils';
import { environment } from 'environments/environment';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'verisure-resultadoconsulta',
  templateUrl: './resultadoconsulta.component.html',
  styleUrls: ['./resultadoconsulta.component.scss'],
  standalone: true,
  imports: [
  CommonModule,
    ScreenKitinicialComponent,
    CommonsComponentsComponent,
    BreadcrumbComponent,
    ResultadoconsultaLayoutComponent,
    TabComponent,
    ButtonComponent,
    NextStepComponent,
    ScreenPacksComponent,
    ScreenDescuentosComponent,
    ScreenResumenComponent,
  ],
})
export class ResultadoconsultaComponent implements OnInit, OnDestroy {
  private routeId!: string;
  form!: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public consultaService: ConsultaOfertaService,
    public requestStatusService: RequestStatusAlertService,
    public authService: AuthService,
    private loaderService: LoaderService,
    private titleHead: Title
  ) {
    this.titleHead.setTitle('Oferta | Ventas | Consulta oferta Verisure');
  }

  paycodeSelected!: string;
  authorizationSelected!: string;
  priceSelectedInfo!: DetalleOfferT;

  set cuponCurrentState(value: boolean) {
    if (this.ofertaSeleccionada.cupon !== value) {
      this.ofertaSeleccionada.cupon = value;
      this.updateData({
        usoCupon: value,
      });
    }
    this._cuponCurrentState = value;
  }
  get cuponCurrentState(): boolean {
    return this._cuponCurrentState;
  }
  private _cuponCurrentState = false;
  set priceSelected(value: string | null) {
    this._priceSelected = value;
    this.priceSelectedTrigger(value);
  }
  get priceSelected(): string | null {
    return this._priceSelected;
  }
  private _priceSelected: string | null = '';
  breadcrumbsItems: { id: string; label: string; disabled?: boolean }[] =
    breadcrumbsItemsDefaultValues;
  breadSelectedLevel = '0';
  // authorizationSelected: paycodeSelectionsT = 'cf';
  resumenData!: ResumenT;
  allProduct!: productsBaseT[];
  offerData!: offerDataT;
  clientData!: clientDataT;
  mixClientData!: Array<{
    key: string;
    value: string;
  }>;
  ofertaSeleccionada: ofertaSeleccionadaT = {
    kitSelected: null,
    idPrecio: null,
    cupon: false,
    medioPagoMonitoreo: '',
  };
  readMode = false;
  kitList!: productListT[] | null | undefined;
  packList!: productListT[];
  dataStatus:
    | offerResponseStatus.SUCCESS
    | offerResponseStatus.ERROR
    | offerResponseStatus.PROCCESS = offerResponseStatus.PROCCESS;

  ngOnInit() {
    this.loaderService.show('Consultando oferta, por favor espera un momento');
    this.navigateByQueryParams().then((isError) => {
      if (isError) {
        this.loaderService.hide();
        return;
      }
      this.getOfferDataTimeOut();
    });
  }
  ngOnDestroy() {
    this.consultaService.destroyIterationInstance();
  }

  getPdf = () => {
    this.loaderService.show('Generando PDF, por favor espera un momento');

    this.authService.currentAuthToken
      .then((token) => {
        const url =
          environment.apigateway_url +
          '/generatePdf?idOferta=' +
          this.offerData.id.toString() +
          '&code=' +
          token;

        const headerName = 'content-type';
        const headerValue = 'application/pdf';
        const headers = new Headers();
        headers.append(headerName, headerValue);
        fetch(url, {
          headers: headers,
          method: 'GET',
        })
          .then((response) => response.blob())
          .then((blob) => {
            const objectURL = URL.createObjectURL(blob);
            window.open(objectURL, '_blank');
            this.loaderService.hide();
            this.router.navigate(['successful-download']);
          });
      })
      .catch(() => {
        this.loaderService.hide();
        this.router.navigate(['failed-download']);
      });
  };
  // cada vez que precio cambia, esta funcion guardara dato en backend
  updateData(formData: {
    usoCupon?: boolean | null;
    idProducto?: string | null;
    idDetalleOferta?: string | null;
  }) {
    this.consultaService
      .updateOfferSelectedInfo({
        id: this.offerData.id,
        data: { ...formData, medioPagoMonitoreo: this.paycodeSelected },
      })
      .then((req) => {
        this.requestStatusService.success({
          status: 200,
          message: 'Datos actualizados',
        });
      });
  }
  private navigateByQueryParams() {
    return new Promise((resolve, reject) => {
      this.route.params.subscribe((params) => {
        if (params !== undefined && this.setIdByParams(params)) {
          //break line
          resolve(true);
          return;
        }
        resolve(false);
      });
    });
  }
  private getOfferDataTimeOut() {
    const timer: asyncCallParamsT = {
      timeout: 200, // 0.2 segundos
      maxTimeout: 100000,
      service: async () =>
        await this.consultaService.getOfferByOfferId({ id: this.routeId }),

      callBack: (value: unknown) => {
        if (value === undefined) {
          this.dataStatus = offerResponseStatus.ERROR;
        }
        const offer = value as offerT;
        return this.offerDataCallBack(offer);
      },
    };
    this.consultaService.initIterationInstance();
    this.consultaService.asyncTimeOutFn(timer);
    this.loaderService.hide();
  }

  private offerDataCallBack(offer: offerT) {
    if (offer.estado === offerResponseStatus.SUCCESS) {
      this.provideAppDataBy(offer);
      this.selectBreadByFragment();
    }
    const booleanResponse =
      offer.estado === undefined ||
      offer.estado === null ||
      offer.estado === offerResponseStatus.PROCCESS;
    this.dataStatus = booleanResponse
      ? offerResponseStatus.PROCCESS
      : offer.estado;
    return booleanResponse || offer.estado === offerResponseStatus.ERROR;
  }

  private provideAppDataBy(offer: offerT) {
    this.offerData = {
      id: offer.idOferta,
      fechaDeCreacion: offer.fechaDeCreacion,
      fechaDeVencimiento: offer.fechaDeVencimiento ?? '',
      delegacion: offer.delegacion, //
      centroCosto: offer.centroCosto
    };
    this.clientData = {
      rut: offer.persona?.rut,
      nombres: offer.persona?.nombres,
      apellidos: offer.persona?.apellidos,
      tipoCliente: offer?.tipoCliente,
      tipoRecurso: offer?.tipoRecurso,
      numeroProspecto: offer?.prospecto,
    };
    this.mixClientData = [
      {
        key: 'RUT',
        value: offer.equifax.estadoCache,
      },
    ];
    this.readMode = offer.modo === offerModeStatus.R;

    // hacer una copia de los datos que el usuario puede cambiar
    this.kitList =
      offer.productos.filter((product) => product.tipoProducto === 'KIT') ?? [];
    console.log(this.kitList);
    // this.kitList = [];
    this.packList = offer.productos.filter(
      (product) => product.tipoProducto === 'PACK'
    );
    if (offer.seleccion && offer.seleccion.idProducto !== null) {
      this.ofertaSeleccionada = {
        kitSelected: offer.seleccion.idProducto?.toString() ?? null,
        idPrecio: offer.seleccion.idDetalleOferta?.toString() ?? null,
        cupon: offer.seleccion.usoCupon ?? false,
        medioPagoMonitoreo: offer.seleccion.medioPagoMonitoreo,
      };
      this.paycodeSelected = offer.seleccion.medioPagoMonitoreo;
      this.priceSelected =
        offer.seleccion.idProducto + '---' + offer.seleccion.idDetalleOferta;
    }
    this.cuponCurrentState = offer.seleccion?.usoCupon ?? false;
  }
  private selectBreadByFragment() {
    this.route.fragment.subscribe((fragment) => {
      console.log(this.priceSelected, 'price value');
      if (
        fragment &&
        this.priceSelected !== undefined &&
        this.priceSelected !== null &&
        this.priceSelected.length > 0
      ) {
        const tabs = this.breadcrumbsItems.map((values) => values.id);
        if (tabs.includes(fragment)) {
          this.breadSelectedLevel = fragment;
        }
      }
    });
  }
  private setIdByParams(params: Params): boolean {
    // get real id by param
    this.routeId = atob(params['id']);
    // eslint-disable-next-line no-extra-boolean-cast
    if (this.routeId === undefined || !!!this.routeId) {
      this.router.navigate(['server-error']);
      return true;
    }
    return false;
  }
  private priceSelectedTrigger(value: string | null) {
    if (value === undefined || value === null) {
      this.breadcrumbsItems = [
        { id: '0', label: 'Kit Inicial', disabled: false },
        { id: '1', label: 'Descuentos', disabled: true },
        { id: '2', label: 'Packs', disabled: true },
        { id: '3', label: 'Resumen', disabled: true },
      ];
    }
    if (value && this.kitList && value !== null) {
      this.breadcrumbsItems = [
        { id: '0', label: 'Kit Inicial', disabled: false },
        { id: '1', label: 'Descuentos', disabled: false },
        { id: '2', label: 'Packs', disabled: false },
        { id: '3', label: 'Resumen', disabled: false },
      ];
      const [kitId, priceId] = value.split('---');
      const currentKit = this.kitList.filter(
        (kit) => kit.idProducto.toString() === kitId
      )[0];
      const detalleOferta = currentKit.detalleOferta.filter(
        (detalle) => detalle.idDetalleOferta.toString() === priceId
      )[0];

      this.priceSelectedInfo = detalleOferta;
      this.resumenData = {
        ...this.offerData,
        ...this.clientData,
        glosaProducto: currentKit.glosaProducto,
        autorizacion: detalleOferta.autorizacion,
        montoInstalacion: detalleOferta.montoInstalacion,
        monedaInstalacion: detalleOferta.monedaInstalacion,
        montoServicio: detalleOferta.montoServicio,
        monedaServicio: detalleOferta.monedaServicio,
        medioPagoMonitoreo: this.paycodeSelected ,
        medioPagoInstalacion: detalleOferta.medioPagoInstalacion,
        permiteCupon: detalleOferta.datosAdicionales.permiteCupon ?? false,
        permiteRenove: detalleOferta.datosAdicionales.permiteRenove ?? false,
        tipoCuotaGlosa: detalleOferta.datosAdicionales.tipoCuotaGlosa,
      };
    }
    const kitAndPriceSelected = value?.split('---') ?? [];
    const _idKit =
      kitAndPriceSelected[0]?.length === 0
        ? null
        : kitAndPriceSelected[0] ?? null;
    const _idPrecio =
      kitAndPriceSelected[1]?.length === 0
        ? null
        : kitAndPriceSelected[1] ?? null;

    if (
      this.ofertaSeleccionada.kitSelected != _idKit ||
      this.ofertaSeleccionada.idPrecio != _idPrecio
    ) {
      this.ofertaSeleccionada = {
        kitSelected: _idKit,
        idPrecio: _idPrecio,
        cupon: this.ofertaSeleccionada.cupon,
        medioPagoMonitoreo: this.paycodeSelected ,
      };
      this.updateData({
        idProducto: _idKit,
        idDetalleOferta: _idPrecio,
      });
    }
  }
}
type clientDataT = {
  rut: string;
  nombres: string;
  apellidos: string;
  tipoCliente: string;
  tipoRecurso: string;
  numeroProspecto: string;
};
type ofertaSeleccionadaT = {
  kitSelected: string | null;
  idPrecio: string | null;
  cupon: boolean;medioPagoMonitoreo: string;

};
type offerDataT = {
  id: number;
  fechaDeCreacion: string;
  fechaDeVencimiento: string;
  delegacion: string;
  centroCosto: string;
};
