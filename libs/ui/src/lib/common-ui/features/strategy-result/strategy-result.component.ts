import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MotorDeReglaStatusEnum } from '@verisure/services';
import { AlertComponent } from '../../components/alert/alert.component';
import { CardItemComponent } from '../../components/card-item/card-item.component';
import { TinyCardComponent } from '../../components/tiny-card/tiny-card.component';
import { capitalizeFullName, formatearRut } from '../offers-to-offer/utils';
import { offerResponseStatus } from '../offers-to-offer/utils.type';

@Component({
  selector: 'verisure-strategy-result',
  templateUrl: './strategy-result.component.html',
  styleUrls: ['./strategy-result.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, AlertComponent, CardItemComponent, TinyCardComponent],
})
export class StrategyResultComponent {
  @Input() info!: {
    id: string | number;
    estado:
      | offerResponseStatus.SUCCESS
      | offerResponseStatus.ERROR
      | offerResponseStatus.PROCCESS;
  };
  @Input() alertStatus!: {
    status: number;
    message: string;
  } | null;
  @Input() content!: {
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

  //
  contentStatusEnum = MotorDeReglaStatusEnum;
  status = {
    SUCCESS: offerResponseStatus.SUCCESS,
    ERROR: offerResponseStatus.ERROR,
    PROCCESS: offerResponseStatus.PROCCESS,
  };

  currentImgSrc() {
    return (
      'assets/scoring-media/' +
      MotorDeReglaStatusDisct[
        (this.content.motorDeRegla?.estadoId as '1' | '2' | '3' | '4') ?? '4'
      ] +
      '-icon.svg'
    );
  }
  formatDate(isoDate: string) {
    const date =
      isoDate && isoDate?.length > 0
        ? new Date(isoDate)
        : new Date(Date.now() + 23123231);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().substr(-2);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const formattedDate = `${day}-${month}-${year} a las ${hours}:${minutes}:${seconds}`;
    return formattedDate; // Output: 31-03-23
  }
  capitalizeFullName(name: string): string {
    return capitalizeFullName(name);
  }
  replaceDotWithComma = (float: number | string) =>
    float.toString().replace(/\./g, ',');
  formatearRut(rut: string): string {
    return formatearRut(rut);
  }
}
export const MotorDeReglaStatusDisct = {
  1: 'televentas',
  3: 'visita',
  2: 'tele-visita',
  4: 'sin-cobertura',
};
