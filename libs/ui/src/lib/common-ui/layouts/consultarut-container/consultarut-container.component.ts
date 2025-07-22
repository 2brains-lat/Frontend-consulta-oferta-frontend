import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { GetProfileBodyType } from '@verisure/services';
import { capitalizeFullName } from '../../features/offers-to-offer/utils';
@Component({
  selector: 'verisure-consultarut-container',
  templateUrl: './consultarut-container.component.html',
  styleUrls: ['./consultarut-container.component.scss'],
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
})
export class ConsultarutContainerComponent {
  @Input()
  dataUserLogged!: GetProfileBodyType;

  capitalizeFullName(name: string): string {
    return capitalizeFullName(name);
  }
}
