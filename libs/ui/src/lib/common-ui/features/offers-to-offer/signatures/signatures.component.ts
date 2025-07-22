import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  OnDestroy,
} from '@angular/core';
import { ConsultaOfertaService, FirmantesDto } from '@verisure/services';
import { asyncCallParamsAuditT, asyncCallParamsT } from '../utils.type';
import { environment } from 'environments/environment';
import { asyncTimeOutFn, formatearRut } from '../utils';
import { CommonModule } from '@angular/common';
import { CardItemComponent } from '../../../components/card-item/card-item.component';
import { ButtonComponent } from '../../../components/button/button.component';
import { AlertComponent } from '../../../components/alert/alert.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'verisure-signatures',
  templateUrl: './signatures.component.html',
  styleUrls: ['./signatures.component.scss'],
  standalone: true,
  imports: [CommonModule, CardItemComponent, ButtonComponent, AlertComponent],
  encapsulation: ViewEncapsulation.None,
})
export class SignaturesComponent implements OnInit, OnDestroy {
  firmantes!: FirmantesDto;
  enableSignatures!: boolean;
  currentRut: BehaviorSubject<string> = new BehaviorSubject<string>('');
  @Input()
  rut!: string;
  constructor(private consultaApiService: ConsultaOfertaService) {
    return;
  }
  ngOnInit() {
    this.currentRut.next('');
    this.enableSignatures = this.checkEnableSignature();
  }
  ngOnDestroy(): void {
    this.currentRut.next('');
  }
  checkEnableSignature() {
    if (this.rut.length > 0) {
      return (
        Number(this.rut.replace(/\./g, '').trim().split('-')[0]) >
        Number(environment.form.rango_rut)
      );
    }
    return false;
  }

  async firmantesOnSubmit() {
    this.currentRut.next(this.rut);
    this.firmantes = {
      exito: false,
      estadoTransaccion: 'EnProceso',
      resultado: null,
    };

    const timer: asyncCallParamsAuditT = {
      timeout: 5000, // 5 segundos
      maxTimeout: 40000, // 40 segundos
      service: async () =>
        await this.consultaApiService
          .getFirmantes({ rut: this.rut })
          .then((e) => e)
          .catch((error) => {
            console.log('getFirmantes ERROR :', error);

            this.firmantes = { ...error, exito: null } as FirmantesDto;
          }),
      callBack: (newFirmantes: unknown) => {
        this.firmantes = newFirmantes as FirmantesDto;
        return new Promise((resolve, reject) => {
          this.currentRut.subscribe((e) => {
            if (this.rut !== e) {
              resolve(false);
            } else {
              resolve(!(newFirmantes as FirmantesDto).exito ?? false);
            }
          });
        });
      },
    };
    this.consultaApiService.asyncTimeOutSignFn(timer);
  }
  formatearRut(rut: string): string {
    return formatearRut(rut);
  }
  formatDate(isoDate: string) {
    const date =
      isoDate && isoDate?.length > 0
        ? new Date(isoDate)
        : new Date(Date.now() + 23123231);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().substr(-2);
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate; // Output: 31-03-23
  }
}
