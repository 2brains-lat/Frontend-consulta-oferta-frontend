import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardOfferInfoComponent } from '../../../components/card-offer-info/card-offer-info.component';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { ExpansionComponent } from '../../../components/expansion/expansion.component';
import { HeadCollapsibleComponent } from '../../../components/head-collapsible/head-collapsible.component';
import { capitalizeFullName, formatearRut } from '../utils';

enum TitleItemsUser {
  rut = 'RUT',
  tipoCliente = 'Tipo cliente',
  tipoRecurso = 'Recurso',
  numeroProspecto = 'Número prospecto',
}

@Component({
  selector: 'verisure-offers-commons-components',
  standalone: true,
  imports: [
    CommonModule,
    CardOfferInfoComponent,
    BreadcrumbComponent,
    ExpansionComponent,
    HeadCollapsibleComponent,
  ],
  templateUrl: './commons-components.component.html',
  styleUrls: ['./commons-components.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CommonsComponentsComponent implements OnInit {
  @Input() resultCardInfo: {
    id: number;
    delegation: string;
    createdDate: string;
    expiredDate: string;
  } = {
    id: 0,
    delegation: '',
    createdDate: '',
    expiredDate: '',
  };

  @Input() userCardInfo: {
    rut: string;
    nombres: string;
    apellidos: string;
    tipoCliente: string;
    tipoRecurso: string;
    numeroProspecto: string;
  } = {
    rut: '',
    nombres: '',
    apellidos: '',
    tipoCliente: '',
    tipoRecurso: '',
    numeroProspecto: '',
  };

  @Input() mixUserInfo: Array<{ key: string; value: string }> = [];

  content: Array<{
    mainKey: string;
    value: Array<{ value: string; type: string }> | string;
    type: string;
  }> = [];

  ngOnInit(): void {
    this.addFirstMixInfo();
    this.addRemainInfo();
  }
  dateFormating(date: string | undefined): string {
    return date && date.length > 0 ? date : new Date().toString();
  }
  addFirstMixInfo() {
    const resultMix: Array<{ value: string; type: string }> | string = [];
    this.mixUserInfo.forEach((item) => {
      if (item && item.value !== null) {
        resultMix.push(this.formatMixInfo(item));
      }
    });
    if (resultMix && resultMix.length > 0) {
      this.content.push({
        mainKey: 'mixInfo',
        value: resultMix.length > 0 ? resultMix : '',
        type: 'mix',
      });
    }
  }

  getFinalTitle(key: string) {
    const keysTitles = Object.keys(TitleItemsUser);
    const valuesTitles = Object.values(TitleItemsUser);

    const getIndexTitle = keysTitles.findIndex((title) => title === key);
    const result = valuesTitles[getIndexTitle];

    return result;
  }
  formatearRut(rut: string): string {
    return formatearRut(rut);
  }
  capitalizeFullName(name: string): string | Date {
    return capitalizeFullName(name);
  }

  addRemainInfo() {
    const copyUserInfo = {
      ...this.userCardInfo,
    };
    const keys = Object.keys(copyUserInfo);
    const values = Object.values(copyUserInfo);

    keys.forEach((k: string, index) => {
      if (k !== 'rut' && k !== 'nombres' && k !== 'apellidos') {
        values[index]
          ? this.content.push({
              mainKey: this.getFinalTitle(k),
              value: values[index],
              type: 'text',
            })
          : null;
      }
    });
  }

  formatMixInfo(info: any): { value: string; type: string } {
    let result: {
      value: string;
      type: string;
    };

    if (info.key === 'RUT') {
      if (info.value.toString().toUpperCase() === 'CACHE') {
        result = {
          value: `${info.key} ${capitalizeFullName(info.value)}`,
          type: 'icon-status-rut-cache',
        };
      } else {
        result = {
          value: `${info.key} ${capitalizeFullName(info.value)}`,
          type: 'icon-status-rut-nuevo',
        };
      }
    } else {
      result = {
        value: `${info.key}: ${info.value}`,
        type: 'icon-calendar-user',
      };
    }

    return result;
  }
}
