export type price = {
  precioInstalacion: number | null;
  precioMonitoreo: number | null;
  cheque: boolean | null;
  tarjeta: boolean | null;
  contado: boolean | null;
  permiteCupon: boolean | null;
  permiteRenove: boolean | null;
  descuentoMonitoreo: number | null;
  mesesDescuento: number | null;
  precioInstalacionPai: number | null;
  precioMonitoreoPai: number | null;
  cfmonitoreo: boolean | null;
  pacmonitoreo: boolean | null;
  patmonitoreo: boolean | null;
};
export type productT = {
  codigo: string | null;
  codigoPAI: string | null;
  tipo: string | null;
  descripcion: string | null;
  subtipo: string | null;
  detalle: string | null;
  precioLista: number | null;
  precios: preciosT[];
};
export type preciosT = {
  title: string | null;
  key: string | null;
  precioInstalacion?: number | null;
  precioMonitoreo?: number | null;
  cheque?: boolean | null;
  tarjeta?: boolean | null;
  contado?: boolean | null;
  permiteCupon?: boolean | null;
  permiteRenove?: boolean | null;
  descuentoMonitoreo?: number | null;
  mesesDescuento?: number | null;
  precioInstalacionPai?: number | null;
  precioMonitoreoPai?: number | null;
  cfmonitoreo?: boolean | null;
  pacmonitoreo?: boolean | null;
  patmonitoreo?: boolean | null;
};
export type paycodesT = { value: string; label: string; disabled?: boolean }[];
export type paycodeSelectionsT = 'pat' | 'pac' | 'cf';

export type offerBasicT = {
  idOferta: number;
  estado:
    | offerResponseStatus.SUCCESS
    | offerResponseStatus.ERROR
    | offerResponseStatus.PROCCESS;
  centroCosto: string;
  equifax: {
    estadoCache: 'nuevo' | 'cache';
    fechaConsultado: string;
    ise: string;
    score: number;
  };
  fechaDeCreacion: string;
  fechaDeVencimiento: string;
  tipoInmueble: string;
  tipoSegmento: string;
  tipoRecurso: string;
  tipoCliente: string; // si es que existe
  modo: offerModeStatus.R | offerModeStatus.WR;
  prospecto: string;
  delegacion: string;
  codigoCentroCosto: string;
  persona: {
    rut: string;
    nombres: string;
    apellidos: string;
    firmantes: string[] | null; // si es que existe
  };
  colaborador: {
    nombreCompleto: string;
    matricula: string;
    email: string;
  };
  codigoQr: string; // debería ser un base64 // Puede incluir un dato de “FechaImpresion” ,
  seleccion: {
    idProducto: number | null;
    idDetalleOferta: number | null;
    usoCupon: boolean | null;
    medioPagoMonitoreo: string;
  };
};
export type offerT = offerBasicT & {
  productos: productListT[];
};

export enum offerResponseStatus {
  SUCCESS = 'PROCESADO',
  ERROR = 'FALLIDO',
  PROCCESS = 'PROCESANDO',
}
export enum offerModeStatus {
  R = 'LECTURA',
  WR = 'ESCRITURA',
}
export type offerBaseT = {
  idOferta: string;
  centroCosto: number;
  equifax: {
    estadoCache: 'nuevo' | 'cache';
    fechaConsultado: string;
    ise: string;
    score: number;
  };
  estado:
    | offerResponseStatus.SUCCESS
    | offerResponseStatus.ERROR
    | offerResponseStatus.PROCCESS;
  fechaDeCreacion: string;
  fechaDeVencimiento: string;
  tipoInmueble: string;
  tipoSegmento: string;
  modo: offerModeStatus.R | offerModeStatus.WR;
  tipoRecurso: string;
  prospecto: string;
  delegacion: string;
  codigoCentroCosto: string;
  persona: {
    rut: string;
    nombres: string;
    apellidos: string;
    firmantes: string[] | null; // si es que existe
    tipoCliente: string; // si es que existe
  };
  colaborador: {
    nombres: string;
    apellidos: string;
    matricula: string;
    email: string;
  };
  codigoQr: string; // debería ser un base64 // Puede incluir un dato de “FechaImpresion” ,
  seleccion: {
    idProducto: number | null;
    idDetalleOferta: number | null;
    usoCupon: boolean | null;
  };
  productos: productsBaseT[];
};

export type productsBaseT = {
  idProducto: string;
  glosaProducto: string;
  detalle: string; // detalle o descripcion agregar
  tipoProducto: string; // pack | kit
  detalleOferta: detalleOfertaBaseT[];
};

export type datosAdicionalesT = {
  permiteCupon: boolean | null;
  permiteRenove: boolean | null; //(cf, pac, pacd o pat)
  permiteSegundaCuenta: boolean | null; //(normal o pai)
  permiteDescuentoMonitoreo: boolean | null; //(UF)
  porcentajeDescuentoMonitoreo: number | null;
  mesesDescuentoMonitoreo: number | null;
  tipoCuotaId: number | null;
  tipoCuotaGlosa: string;
  vigencia: string;
};
export type precioInstalacionT = {
  id: string;
  paycode: string; //(cf, pac, pacd o pat)
  tipoDePago: string; //(normal o pai)
  precio: number; //(chilean pesos)
  descuentoRenove: boolean | null;
  descuentoCupon: boolean | null;
};

export type productListT = {
  idProducto: string;
  glosaProducto: string;
  detalle: string; // detalle o descripcion agregar
  tipoProducto: string;
  paycodeList: { value: string; label: string }[];
  detalleOferta: DetalleOfferT[];
};

export type detalleOfertaBaseT = {
  idDetalleOferta: string;
  categoria: string;
  montoInstalacion: number;
  montoServicio: number;
  nodo: number;
  autorizacionId: number;
  monedaInstalacion: string;
  monedaServicio: string;
  vigencia: string;
  medioPagoMonitoreo: string;
  glosaNodo: string;
  autorizacion: string;
  medioPagoInstalacion: string[];
  datosAdicionales: datosAdicionalesT;
};

export type DetalleOfferT = {
  idDetalleOferta: string;
  montoInstalacion: number;
  monedaInstalacion: string;
  montoServicio: number;
  monedaServicio: string;
  glosaNodo: string | null;
  vigencia: string;
  medioPagoMonitoreo: string[];
  autorizacionId: number;
  autorizacion: string;
  medioPagoInstalacion: string[];
  datosAdicionales: datosAdicionalesT;
};
export type AdditionalDataT = {
  permiteCupon?: boolean;
  permiteRenove?: boolean;
  permiteSegundaCuenta?: boolean;
  permiteDescuentoMonitoreo?: boolean;
  porcentajeDescuentoMonitoreo?: number;
  mesesDescuentoMonitoreo?: number;
  tipoCuotaId?: number;
  tipoCuotaGlosa?: string;
  vigencia?: string | null;
};

export type ResumenT = {
  id: number;
  fechaDeCreacion: string;
  fechaDeVencimiento: string;
  delegacion: string;
  centroCosto?: string;
  rut: string;
  nombres: string;
  apellidos: string;
  tipoCliente: string;
  tipoRecurso: string;
  glosaProducto: string;
  autorizacion: string;
  montoInstalacion: number;
  monedaInstalacion: string;
  montoServicio: number;
  monedaServicio: string;
  medioPagoMonitoreo: string | string[];
  medioPagoInstalacion: string[];
  permiteCupon?: boolean;
  permiteRenove?: boolean;
  tipoCuotaGlosa?: string;
  [key: string]: any;
};
export type asyncCallParamsT = {
  timeout: number; // 20 segundos
  maxTimeout: number;
  service: () => Promise<any>;
  callBack: (newData: unknown) => boolean;
};
export type asyncCallParamsAuditT = {
  timeout: number; // 20 segundos
  maxTimeout: number;
  service: () => Promise<any>;
  callBack: (newData: unknown) => Promise<boolean>;
};
