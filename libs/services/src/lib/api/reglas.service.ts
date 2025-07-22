/* eslint-disable no-async-promise-executor */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { AuthService } from './auth.service';
import { ALERT_FLAG } from './consulta-oferta.service';
import { getCache } from './utils';
import { createCache } from './utils';

@Injectable({
  providedIn: 'root',
})
export class ReglasService {
  constructor(private http: HttpClient, private authService: AuthService) {}
  getAllBusinessRules(
    { isCacheIgnored } = {
      isCacheIgnored: false,
    }
  ): Promise<BusinessRuleT[]> {
    return new Promise(async (resolve, reject) => {
      if (isCacheIgnored) {
        const cache = getCache('getAllBusinessRules');
        if (cache) {
          resolve(cache);
        }
      } else {
        this.http
          .get<BusinessRuleT[]>(environment.apigateway_url + '/rules', {
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store, no-cache, must-revalidate',
              
              Authorization:
                'Bearer ' + (await this.authService.currentAuthToken),
            },
          })
          .subscribe((value) => {
            createCache('getAllBusinessRules', value, 0);
            resolve(value);
          });
      }
    });
  }
  updateBusinessRules({ id, formData }: { formData: FormData; id: string }) {
    // return id of consulting
    return new Promise(async (resolve, reject) => {
      this.http
        .post<{ id: string }>(
          environment.apigateway_url +
            '/upload-' +
            (downloadPathDict[id] ?? downloadPathDict[idInterface.RSV]),
          formData,
          {
            headers: {
              'Cache-Control': 'no-store, no-cache, must-revalidate',
              
              Authorization:
                'Bearer ' + (await this.authService.currentAuthToken),
            },
            context: new HttpContext().set(ALERT_FLAG, true),
          }
        )
        .subscribe(
          (value) => {
            resolve(value);
            this.getAllBusinessRules({ isCacheIgnored: true });
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  downloadRules({ id }: { id: string | number }): Promise<HttpResponse<Blob>> {
    // return id of consulting
    console.log(downloadPathDict[id], id);
    return new Promise(async (resolve, reject) => {
      this.http
        .get(
          environment.apigateway_url +
            '/' +
            (downloadPathDict[id] ?? downloadPathDict[idInterface.RSV]) +
            (id === idInterface.ROA || id === idInterface.ROB ? '' : '-rules'),
          {
            observe: 'response',
            responseType: 'blob',
            headers: {
              'Cache-Control': 'no-store, no-cache, must-revalidate',
              
              'content-type': 'application/octet-stream',
              Accept: 'application/octet-stream',
              Authorization:
                'Bearer ' + (await this.authService.currentAuthToken),
            },
            context: new HttpContext().set(ALERT_FLAG, true),
          }
        )
        .subscribe((value) => resolve(value));
    });
  }
}

export type BusinessRuleT = {
  titulo: string;
  descripcion: string;
  ultimaCarga: string;
  reglasVigente: number | null;
  nombreArchivo: string;
  identificador: string;
  tipo: string;
};

export const idInterface = {
  RSV: 'RSV',
  ROA: 'ROA',
  ROB: 'ROB',
  RON: 'RON',
  RSM: 'RSM',
  RSF: 'RSF',
  REC: 'REC',
};
export const iconDict = {
  [idInterface.RSV]: 'regla-rsv-icon',
  [idInterface.ROA]: 'regla-roa-icon',
  [idInterface.ROB]: 'regla-rob-icon',
  [idInterface.RON]: 'regla-ron-icon',
  [idInterface.RSM]: 'regla-rsm-icon',
  [idInterface.RSF]: 'regla-rsf-icon',
  [idInterface.REC]: 'regla-rec-icon',
};
export const downloadPathDict = {
  [idInterface.RSV]: 'sale-segments',
  [idInterface.ROA]: 'active-offers',
  [idInterface.ROB]: 'base-offers',
  [idInterface.RON]: 'node-segments',
  [idInterface.RSM]: 'marketing-segments',
  [idInterface.RSF]: 'finance-segments',
  [idInterface.REC]: 'commercial-strategies',
};
export const tipoReglas = {
  VENTAS: 'TR_VENTAS',
  FINANZAS: 'TR_FINANZAS',
  MARKETING: 'TR_MARKETING',
};
