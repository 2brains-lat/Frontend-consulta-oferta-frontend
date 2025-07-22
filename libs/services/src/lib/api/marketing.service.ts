/* eslint-disable no-async-promise-executor */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { offerResponseStatus } from '@verisure/ui/types';
import { environment } from 'environments/environment';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { ALERT_FLAG } from './consulta-oferta.service';
import { createCache, getCache } from './utils';

@Injectable({
  providedIn: 'root',
})
export class MarketingService {
  public iterationStatus: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
  constructor(private http: HttpClient, private authService: AuthService) {}
  getComunas() {
    // return id of consulting
    return new Promise(async (resolve, reject) => {
      const cache = getCache('getComunas');
      if (cache) {
        resolve(cache);
      } else {
        this.http
          .get<ComunasType>(environment.apigateway_url + '/comuna', {
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store, no-cache, must-revalidate',
              
              Authorization:
                'Bearer ' + (await this.authService.currentAuthToken),
            },
          })
          .subscribe((value) => {
            console.log(value, 'getComunas ');
            createCache('getSegmentos', value, 1000000000);
            resolve(value);
          });
      }
    });
  }
  getStrategy({ id }: { id: string }): Promise<StrategyType> {
    // return id of consulting
    return new Promise(async (resolve, reject) => {
      this.http
        .get<StrategyType>(
          environment.apigateway_url + '/commercial-strategy/' + id,
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
          console.log(value, 'getStrategy,  dummy:');
          resolve(value);
        });
    });
  }
  postNewConsulting(form: ConsultaEstrategiaT): Promise<{ id: string }> {
    return new Promise(async (resolve, reject) => {
      this.http
        .post<{
          id: string;
        }>(environment.apigateway_url + '/commercial-strategy', form, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            
            Authorization:
              'Bearer ' + (await this.authService.currentAuthToken),
          },
        })
        .subscribe((e: { id: string }) => resolve({ id: e.id }));
    });
  }
  initIterationInstance(id: string) {
    this.iterationStatus.next(id);
  }
  destroyIterationInstance() {
    this.iterationStatus.next('');
  }

  asyncTimeOutFn($this: asyncCallParamsMarketingT) {
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
}
export enum MotorDeReglaStatusEnum {
  TELEVENTAS = 'televentas',
  VISITA = 'visita',
  TELE_VISITA = 'tele-visita',
  SIN_COBERTURA = 'sin-cobertura',
}

export const MotorDeReglaStatusDict = {
  televentas: MotorDeReglaStatusEnum.TELEVENTAS,
  visita: MotorDeReglaStatusEnum.VISITA,
  'tele-visita': MotorDeReglaStatusEnum.TELE_VISITA,
  'sin-cobertura': MotorDeReglaStatusEnum.SIN_COBERTURA,
};
export type asyncCallParamsMarketingT = {
  timeout: number; // 20 segundos
  maxTimeout: number;
  service: () => Promise<any>;
  callBack: (newData: unknown) => Promise<boolean>;
};

export type StrategyType = {
  id: string | number;
  estado:
    | offerResponseStatus.SUCCESS
    | offerResponseStatus.ERROR
    | offerResponseStatus.PROCCESS;
  data: {
    user: {
      rut: string;
      nombre: string;
      ultimaConsulta: string | null;
      tipoPersona: string;
    };
    equifax: {
      score: string | number;
      ise: string;
    };
    motorDeRegla: {
      estadoGlosa: string;
      estadoId: string;
      idMotorDeRegla: string;
    };
  };
};

export type ComunasType = {
  id: string;
  cut: string;
  glosa: string;
};
export type ConsultaEstrategiaT = {
  rut: string;
  tipoCliente: string | number;
  idComuna: string | number;
  zonaCobertura: boolean;
};
