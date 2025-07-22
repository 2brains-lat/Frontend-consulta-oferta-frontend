/* eslint-disable no-async-promise-executor */
import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  asyncCallParamsAuditT,
  asyncCallParamsT,
  offerBaseT,
  offerModeStatus,
  offerResponseStatus,
  productListT,
} from '@verisure/ui/types';
import { ALERT_FLAG, AuthService } from '@verisure/services';
import * as _ from 'underscore';
import { environment } from 'environments/environment';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  public iterationStatus: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
  constructor(private http: HttpClient, private authService: AuthService) {}

  getOfferByOfferIdAuditVersion({ id }: { id: string | number }) {
    // return id of consulting
    return new Promise(async (resolve, reject) => {
      this.http
        .get<offerBaseT>(environment.apigateway_url + '/audit/' + id, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            
            Authorization:
              'Bearer ' + (await this.authService.currentAuthToken),
          },
          context: new HttpContext().set(ALERT_FLAG, true),
        })
        .subscribe((value) => {
          console.log(value, 'getOffersByRutAuditVersion ');
          resolve(formatOfferData(value));
        });
    });
  }
  getOffersByRutAuditVersion({
    rut,
    size = 5,
    page = 1,
  }: {
    rut: string;
    page?: number;
    size?: number;
  }): Promise<AuditResponseT> {
    // return id of consulting
    return new Promise(async (resolve, reject) => {
      this.http
        .get<AuditResponseT>(
          environment.apigateway_url +
            '/audit?rut=' +
            rut.replace(/\./g, '').trim() +
            '&size=' +
            size +
            '&page=' +
            page,

          {
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store, no-cache, must-revalidate',
              
              Authorization:
                'Bearer ' + (await this.authService.currentAuthToken),
            },
            context: new HttpContext().set(ALERT_FLAG, true),
          }
        )
        .subscribe((value) => {
          resolve(value);
        });
    });
  }

  initIterationInstance(id: string) {
    this.iterationStatus.next(id);
  }
  destroyIterationInstance() {
    this.iterationStatus.next('');
  }

  asyncTimeOutFn($this: asyncCallParamsAuditT) {
    $this.service().then(async (value: string) => {
      $this.callBack(value).then((e: boolean) => {
        console.log(e, ' asyncTimeOutFn 2 iteration status ');
        if (e) {
          const currentTimeout = Math.min(
            $this.timeout * 1.3,
            $this.maxTimeout
          );
          $this.timeout = currentTimeout;
          setTimeout(() => this.asyncTimeOutFn($this), currentTimeout);
        }
      });
    });
  }
  getPDF({ id }: { id: string | number }) {
    // return id of consulting
    return new Promise(async (resolve, reject) => {
      this.http
        .get(
          environment.apigateway_url +
            '/generatePdf?idOferta=' +
            id +
            '?code=' +
            (await this.authService.currentAuthToken),
            {
              headers:{
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                
              }
            }
        )
        .subscribe((value) => {
          resolve(value);
        });
    });
  }
}

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
  pagina: number;
  itemsPorPagina: number;
  totalItems: number;
  totalPaginas: number;
  data: {
    usuario: AuditUser;
    ofertas: AuditListOffer[];
  };
};

const formatOfferData = (value: offerBaseT) => {
  const data = value;
  const productosArray: productListT[] = [];
  _.each(data.productos, (producto) => {
    const detalleOfertaReduce = _.reduce(
      producto.detalleOferta,
      function (curr, next, index) {
        if (index === 0) return curr;
        const indexAlreadyOnNewSet = _.findIndex(
          curr,
          (detailProduct) =>
            detailProduct.idDetalleOferta === next.idDetalleOferta
        );
        if (indexAlreadyOnNewSet !== -1) {
          curr[indexAlreadyOnNewSet].medioPagoMonitoreo.push(
            next.medioPagoMonitoreo
          );
          curr[indexAlreadyOnNewSet] = {
            idDetalleOferta: next.idDetalleOferta,

            montoInstalacion: next.montoInstalacion,
            monedaInstalacion: next.monedaInstalacion,
            montoServicio: next.montoServicio,
            monedaServicio: next.monedaServicio,
            glosaNodo: next.glosaNodo,
            vigencia: next.vigencia,
            medioPagoMonitoreo: curr[indexAlreadyOnNewSet].medioPagoMonitoreo,
            autorizacionId: next.autorizacionId,
            autorizacion: next.autorizacion,
            medioPagoInstalacion: next.medioPagoInstalacion,
            datosAdicionales: {
              ...next.datosAdicionales,
              tipoCuotaGlosa:
                (next.categoria ? next.categoria + ' , ' : '') +
                next.datosAdicionales.tipoCuotaGlosa,
            },
          };
        } else {
          curr.push({
            idDetalleOferta: next.idDetalleOferta,
            montoInstalacion: next.montoInstalacion,
            monedaInstalacion: next.monedaInstalacion,
            montoServicio: next.montoServicio,
            monedaServicio: next.monedaServicio,
            vigencia: next.vigencia,
            glosaNodo: next.glosaNodo,
            medioPagoMonitoreo: [next.medioPagoMonitoreo],
            autorizacionId: next.autorizacionId,
            autorizacion: next.autorizacion,
            medioPagoInstalacion: next.medioPagoInstalacion,
            datosAdicionales: next.datosAdicionales,
          });
        }

        return curr;
      },
      [
        {
          idDetalleOferta: producto.detalleOferta[0].idDetalleOferta,
          montoInstalacion: producto.detalleOferta[0].montoInstalacion,
          monedaInstalacion: producto.detalleOferta[0].monedaInstalacion,
          montoServicio: producto.detalleOferta[0].montoServicio,
          monedaServicio: producto.detalleOferta[0].monedaServicio,
          vigencia: producto.detalleOferta[0].vigencia,
          medioPagoMonitoreo: [producto.detalleOferta[0].medioPagoMonitoreo],
          autorizacionId: producto.detalleOferta[0].autorizacionId,
          glosaNodo: producto.detalleOferta[0].glosaNodo,
          autorizacion: producto.detalleOferta[0].autorizacion,
          medioPagoInstalacion: producto.detalleOferta[0].medioPagoInstalacion,

          datosAdicionales: producto.detalleOferta[0].datosAdicionales,
        },
      ]
    );
    productosArray.push({
      ...producto,
      paycodeList: detalleOfertaReduce
        .flatMap((obj) => obj.medioPagoMonitoreo)
        .filter((valor, index, array) => array.indexOf(valor) === index)
        .map((valor) => ({ value: valor, label: valor })),
      detalleOferta: detalleOfertaReduce,
    });
  });

  return {
    ...data,
    productos: productosArray,
    modo: data.modo ?? offerModeStatus.R,
    estado: data.estado ?? offerResponseStatus.ERROR,
  };
};
