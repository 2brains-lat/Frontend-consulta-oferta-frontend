import {
  Component,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AlertComponent,
  ButtonComponent,
  capitalizeFullName,
  CommonsComponentsComponent,
  formatearRut,
  HeadCollapsibleComponent,
  InputComponent,
  OffertReviewComponent,
  ResultadoconsultaLayoutComponent,
  rutValidator,
  TabComponent,
  TinyCardComponent,
  enterLeaveAlertAnimation
} from '@verisure/ui';
import {
  asyncCallParamsAuditT,
  asyncCallParamsT,
  DetalleOfferT,
  offerResponseStatus,
  offerT,
  productListT,
  ResumenT,
} from '@verisure/ui/types';
import {
  AuditService,
  ConsultaOfertaService,
  LoaderService,
  RequestStatusAlertService,
} from '@verisure/services';
import { environment } from 'environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'verisure-auditoria',
  standalone: true,
  imports: [
    CommonModule,
    ResultadoconsultaLayoutComponent,
    TabComponent,
    InputComponent,
    OffertReviewComponent,
    TinyCardComponent,
    ButtonComponent,
    CommonsComponentsComponent,
    HeadCollapsibleComponent,
    AlertComponent,
  ],
  animations: [enterLeaveAlertAnimation],
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AuditoriaComponent implements OnInit, OnDestroy {
  tabSelectors = [
    {
      value: 'oferta',
      label: 'Búsqueda por oferta',
    },
    {
      value: 'rut',
      label: 'Búsqueda por RUT',
    },
  ];
  reset = false;
  @ViewChild(OffertReviewComponent, { static: false })
  offerRef!: OffertReviewComponent;

  offerData!: offerDataT | null;
  dataStatus:
    | offerResponseStatus.SUCCESS
    | offerResponseStatus.ERROR
    | offerResponseStatus.PROCCESS
    | null = null;
  resumenData!: ResumenT | null;
  offersByRutResponse!: {
    usuario: AuditUser;
    ofertas: AuditListOffer[];
  };
  equifax!: {
    estadoCache: 'nuevo' | 'cache';
    fechaConsultado: string;
    ise: string;
    score: number;
  };
  seller!: {
    nombreCompleto: string;
    matricula: string;
    email: string;
    delegacion: string;
    centroDeCosto: string;
  } | null;
  paginationInfo!: {
    pagina: number;
    itemsPorPagina: number;
    totalItems: number;
    totalPaginas: number;
  };
  form: FormGroup;
  readMode = false;
  priceSelectedInfo!: DetalleOfferT | any;
  enableSignaturesButton!: boolean;
  rut!: string;
  loadMoreSpinner = false;
  kitList!: productListT[] | null | undefined;
  clientData!: {
    rut: string;
    nombres: string;
    apellidos: string;
    tipoCliente: string;
    tipoRecurso: string;
    numeroProspecto: string;
    tipoInmueble: string;
  } | null;
  packList!: productListT[] | null;
  refresh: boolean | null = null;
  detailScreenStatus = false;
  set cuponCurrentState(value: boolean) {
    if (this.ofertaSeleccionada.cupon !== value) {
      this.ofertaSeleccionada.cupon = value;
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

  ofertaSeleccionada: ofertaSeleccionadaT = {
    kitSelected: null,
    idPrecio: null,
    cupon: false,
    medioPagoMonitoreo: '',

  };
  set currentTab(value: 'rut' | 'oferta' | string) {
    if (value === 'oferta') {
      this.title.setTitle(
        'Auditoria (Busqueda por rut) | Admin | Consulta oferta Verisure'
      );
    } else {
      this.title.setTitle('Auditoria | Admin | Consulta oferta Verisure');
    }
    this.dataStatus = null;
    this._currentTab = value;
  }
  get currentTab() {
    return this._currentTab;
  }
  private _currentTab: 'rut' | 'oferta' | string = 'oferta';
  alertStatus: { status: number; message: string } | null = null;
  constructor(
    private auditService: AuditService,
    private loaderService: LoaderService,
    public fb: FormBuilder,
    private title: Title,
    private alertService: RequestStatusAlertService
  ) {
    this.form = fb.group({
      rut: ['', [Validators.required, rutValidator()]],
    });
  }
  ngOnInit() {
    this.title.setTitle('Auditoria | Back Office | Consulta oferta Verisure');
    this.onFormRutChange();
    this.alertService.requestStatus.subscribe((e) => {
      this.loaderService.hide();
      if (e !== null) {
        this.dataStatus = null;
      }
      this.alertStatus = e;
    });
  }
  ngOnDestroy() {
    this.detailScreenStatus = false;
    this.auditService.destroyIterationInstance();
  }
  onSubmit($event: any) {
    console.log(this.offerRef, 'REF');

    this.closeDetailsOfOneOffer();
    this.dataStatus = offerResponseStatus.PROCCESS;
    if (this.currentTab === 'oferta') {
      this.getOfferDataTimeOut($event);
    }
    if (this.currentTab === 'rut') {
      this.rut = $event;
      this.loaderService.show('Cargando Ofertas ...');

      this.getOffersByRut({
        rut: $event,
        size: 5,
      });
    }
  }
  getMoreOffers() {
    this.getOffersByRut({
      rut: this.rut,
      size: this.paginationInfo ? this.paginationInfo.itemsPorPagina + 5 : 5,
    });
  }
  openDetailsOfOneOffer(id: string) {
    this.detailScreenStatus = true;
    this.getOfferDataTimeOut(id);
  }
  closeDetailsOfOneOffer() {
    this.dataStatus = null;
    this.detailScreenStatus = false;
    this.clearData();
    this.auditService.destroyIterationInstance();
  }
  private clearData() {
    this.kitList = null;
    this.equifax = {
      estadoCache: 'nuevo',
      fechaConsultado: '',
      ise: '',
      score: 0,
    };
    this.cuponCurrentState = false;
    this.priceSelectedInfo = null;
    this.clientData = null;
    this.seller = null;
    this.offerData = null;
    this.resumenData = null;
    this.packList = null;
    this.priceSelected = null;
    this.offerRef?.clearData();
  }
  private getOffersByRut({
    rut,
    page = 1,
    size,
  }: {
    rut: string;
    page?: number;
    size: number;
  }) {
    this.loadMoreSpinner = true;
    this.auditService
      .getOffersByRutAuditVersion({ rut, page, size })
      .then((res) => {
        this.alertStatus = null;
        this.offersByRutResponse = res.data;
        this.paginationInfo = {
          pagina: res.pagina,
          itemsPorPagina: res.itemsPorPagina,
          totalItems: res.totalItems,
          totalPaginas: res.totalPaginas,
        };
        return;
      })
      .then((e) => {
        this.loadMoreSpinner = false;
        return;
      })
      .then(() => this.loaderService.hide())
      .catch(() => this.loaderService.hide())
      .finally(() => {
        this.loaderService.hide();
        this.alertStatus = null;
      });
  }

  private getOfferDataTimeOut(id: string) {
    this.kitList = undefined;
    this.packList = [];
    this.clientData = null;
    this.dataStatus = offerResponseStatus.PROCCESS;
    const timer: asyncCallParamsAuditT = {
      timeout: 700, // 0.2 segundos
      maxTimeout: 15000, // 15 seconds
      service: async () =>
        await this.auditService
          .getOfferByOfferIdAuditVersion({ id })
          .then((e) => e)
          .catch((error) => {
            console.log('GET OFFER ERROR !!', error);
            this.dataStatus = null;
          }),
      callBack: (value: unknown) => {
        if (value === undefined) {
          this.dataStatus = offerResponseStatus.ERROR;
        }
        return new Promise((resolve, reject) => {
          this.auditService.iterationStatus.subscribe((e) => {
            if (id !== e) {
              resolve(false);
            } else {
              const offer = value as offerT;
              this.alertStatus = null;
              resolve(this.offerDataCallBack(offer));
            }
          });
        });
      },
    };
    this.auditService.initIterationInstance(id);
    setTimeout(() => this.auditService.asyncTimeOutFn(timer), 300);

    this.loaderService.hide();
  }
  private offerDataCallBack(offer: offerT) {
    if (offer.estado === offerResponseStatus.SUCCESS) {
      this.kitList = undefined;
      this.packList = [];
      this.clientData = null;

      setTimeout(() => {
        this.provideAppDataBy(offer);
      }, 10);
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
    console.log(offer, 'PROVING DATA 223 RESULTADOCONSULTA.COMPONENT.TS');
    this.offerData = {
      id: offer.idOferta,
      fechaDeCreacion: offer.fechaDeCreacion,
      fechaDeVencimiento: offer.fechaDeVencimiento ?? '',
      delegacion: offer.delegacion, //
    };
    this.clientData = {
      rut: offer.persona?.rut,
      nombres: offer.persona?.nombres,
      apellidos: offer.persona?.apellidos,
      tipoCliente: offer?.tipoCliente,
      tipoRecurso: offer?.tipoRecurso,
      numeroProspecto: offer?.prospecto,
      tipoInmueble: offer.tipoInmueble,
    };
    //equifax
    this.equifax = offer.equifax;
    //vendedor
    this.seller = {
      ...offer.colaborador,
      delegacion: offer.delegacion,
      centroDeCosto: offer.centroCosto.toString(),
    };
    this.readMode = false;

    // hacer una copia de los datos que el usuario puede cambiar
    this.kitList =
      offer.productos.filter((product) => product.tipoProducto === 'KIT') ?? [];
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
      this.priceSelected =
        offer.seleccion.idProducto + '---' + offer.seleccion.idDetalleOferta;
    }
    this.cuponCurrentState = offer.seleccion?.usoCupon ?? false;
  }
  private priceSelectedTrigger(value: string | null) {
    if (value && this.kitList && value !== null && this.clientData !== null) {
      const [kitId, priceId] = value.split('---');
      const currentKit = this.kitList.filter(
        (kit) => kit.idProducto.toString() === kitId
      )[0];
      const detalleOferta = currentKit.detalleOferta.filter(
        (detalle) => detalle.idDetalleOferta.toString() === priceId
      )[0];

      this.enableSignaturesButton =
        Number(this.clientData.rut.replace(/\./g, '').trim().split('-')[0]) >
        Number(environment.form.rango_rut);

      this.priceSelectedInfo = detalleOferta;
      if (this.offerData && this.clientData) {
        this.resumenData = {
          ...(this.offerData ?? {}),
          ...(this.clientData ?? {}),
          glosaProducto: currentKit.glosaProducto ?? '',
          autorizacion: detalleOferta?.autorizacion ?? '',
          montoInstalacion: detalleOferta.montoInstalacion ?? '',
          monedaInstalacion: detalleOferta.monedaInstalacion ?? '',
          montoServicio: detalleOferta.montoServicio ?? '',
          monedaServicio: detalleOferta.monedaServicio ?? '',
          medioPagoMonitoreo: this.ofertaSeleccionada.medioPagoMonitoreo,
          medioPagoInstalacion: detalleOferta.medioPagoInstalacion ?? '',
          permiteCupon: detalleOferta.datosAdicionales.permiteCupon ?? false,
          permiteRenove: detalleOferta.datosAdicionales.permiteRenove ?? false,
        };
      }
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
        medioPagoMonitoreo: this.ofertaSeleccionada.medioPagoMonitoreo,
      };
    }
  }
  formatearRut(rut: string): string {
    return formatearRut(rut);
  }
  formatDate(isoDate: string, isLongResponse = false) {
    const date =
      isoDate && isoDate?.length > 0
        ? new Date(isoDate)
        : new Date(Date.now() + 23123231);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().substr(-2);
    let formattedDate = `${day}-${month}-${year}`;
    if (isLongResponse) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      formattedDate = `${formattedDate} a las ${hours}:${minutes}:${seconds}`;
    }
    return formattedDate; // Output: 31-03-23
  }
  onFormRutChange() {
    this.form.get('rut')?.valueChanges.subscribe((value) => {
      const rutFormateado = formatearRut(value);
      this.form.controls['rut'].setValue(rutFormateado, { emitEvent: false });
    });
  }
  capitalizeFullName(name: string): string {
    return capitalizeFullName(name);
  }
  getRun(rut: string) {
    return rut.replace(/\./g, '').trim().split('-')[0];
  }
}
type offerDataT = {
  id: number;
  fechaDeCreacion: string;
  fechaDeVencimiento: string;
  delegacion: string;
};
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
  cupon: boolean;
  medioPagoMonitoreo: string;
};
export type AuditUser = {
  type: string;
  name: string;
  rut: string;
};
export type AuditListOffer = {
  prospecto: string | null;
  id: string;
  descripcion: string | null;
  fechaCreacion: string;
};

export type AuditResponseT = {
  data: {
    usuario: AuditUser;
    ofertas: AuditListOffer[];
  }[];
};
