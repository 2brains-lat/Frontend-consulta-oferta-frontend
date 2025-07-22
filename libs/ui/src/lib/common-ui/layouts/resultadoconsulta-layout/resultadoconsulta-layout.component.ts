import { Component, ViewEncapsulation, Input } from '@angular/core';
import { offerResponseStatus } from '../../features/offers-to-offer/utils.type';
import { AlertComponent } from '../../components/alert/alert.component';
import { CardItemComponent } from '../../components/card-item/card-item.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'verisure-resultadoconsulta-layout',
  templateUrl: './resultadoconsulta-layout.component.html',
  styleUrls: ['./resultadoconsulta-layout.component.scss'],
  standalone: true,
  imports: [CommonModule, AlertComponent, CardItemComponent],
  encapsulation: ViewEncapsulation.None,
})
export class ResultadoconsultaLayoutComponent {
  @Input() resultStatus!:
    | offerResponseStatus.SUCCESS
    | offerResponseStatus.ERROR
    | offerResponseStatus.PROCCESS;
  status = {
    SUCCESS: offerResponseStatus.SUCCESS,
    ERROR: offerResponseStatus.ERROR,
    PROCCESS: offerResponseStatus.PROCCESS,
  };
}
