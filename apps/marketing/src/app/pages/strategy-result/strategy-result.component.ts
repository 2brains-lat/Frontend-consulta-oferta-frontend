import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { offerResponseStatus } from '@verisure/ui/types';
import { AlertComponent, StrategyResultComponent } from '@verisure/ui';
import {
  MarketingService,
  MotorDeReglaStatusDict,
  MotorDeReglaStatusEnum,
  RequestStatusAlertService,
  StrategyType,
} from '@verisure/services';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'verisure-strategy-page',
  standalone: true,
  imports: [CommonModule, StrategyResultComponent],
  templateUrl: './strategy-result.component.html',
  styleUrls: ['./strategy-result.component.scss'],
})
export class StrategyPageComponent implements OnInit, OnDestroy {
  info: {
    id: string | number;
    estado:
      | offerResponseStatus.SUCCESS
      | offerResponseStatus.ERROR
      | offerResponseStatus.PROCCESS;
  } = {
    id: '0',
    estado: offerResponseStatus.PROCCESS,
  };
  content!: {
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
  routeId: string | null = null;
  alertStatus: {
    status: number;
    message: string;
  } | null = null;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private marketingService: MarketingService,
    private alertService: RequestStatusAlertService,
    private titleHead: Title
  ) {
    this.titleHead.setTitle(
      'Estrategia comercial | Marketing | Consulta oferta Verisure'
    );
  }
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.setIdByParams(params);
      if (this.routeId === null || this.routeId === undefined)
        this.router.navigate(['server-error']);
      const timer: any = {
        timeout: 700, // 0.2 segundos
        maxTimeout: 15000, // 15 seconds
        service: async () =>
          await this.marketingService
            .getStrategy({ id: this.routeId ?? '' })
            .then((e) => {
              return e;
            })
            .catch((e) => {
              this.info = {
                id: '1',
                estado: offerResponseStatus.ERROR,
              };
            }),
        callBack: (value: unknown) => {
          if (value === undefined) {
            this.router.navigate(['server-error']);
            return false;
          }
          const content = value as StrategyType;
          return new Promise((resolve, reject) => {
            this.marketingService.iterationStatus.subscribe((e) => {
              if (content.estado === offerResponseStatus.SUCCESS) {
                this.loadData(content);
                resolve(false);
                return;
              }
              if (content.id !== e) {
                resolve(false);
              } else {
                resolve(
                  content.estado === offerResponseStatus.PROCCESS ? true : false
                );
              }
            });
          });
        },
      };
      this.marketingService.initIterationInstance(this.routeId ?? '');
      this.marketingService.asyncTimeOutFn(timer);
    });
    this.alertService.requestStatus.subscribe((e) => {
      if (e === null) {
        return;
      }
      this.alertStatus = e;
    });
  }
  ngOnDestroy() {
    this.marketingService.destroyIterationInstance();
  }
  private loadData(content: StrategyType) {
    this.content = {
      ...content.data,
    };
    this.info = {
      id: content.id,
      estado: content.estado,
    };
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
}
