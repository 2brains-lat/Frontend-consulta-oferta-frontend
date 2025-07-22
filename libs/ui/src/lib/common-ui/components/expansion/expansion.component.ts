import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadCollapsibleComponent } from '../head-collapsible/head-collapsible.component';
import { TinyCardComponent } from '../tiny-card/tiny-card.component';

enum TypeContent {
  isArray,
  isObject,
  isText,
}

@Component({
  selector: 'verisure-expansion',
  standalone: true,
  templateUrl: './expansion.component.html',
  styleUrls: ['./expansion.component.scss'],
  imports: [CommonModule, HeadCollapsibleComponent, TinyCardComponent],
})
export class ExpansionComponent implements OnInit {
  // @Input() headInfo: any = {};
  @Input() content:
    | Array<{
        mainKey: string;
        value: Array<{ value: string; type: string }> | string;
        type: string;
      }>
    | string
    | any = [
    {
      mainKey: 'mixInfo',
      value: [
        {
          value: 'Última consulta: ---',
          type: 'icon-calendar-user',
        },
        {
          value: 'RUT xxxxxxxx-x',
          type: 'icon-status-rut',
        },
      ],
      type: 'mix',
    },
    {
      mainKey: 'Tipo de Persona',
      value: 'Primera categoría',
      type: 'text',
    },
    {
      mainKey: 'Número prospecto',
      value: '444.999',
      type: 'text',
    },
    {
      mainKey: 'Recurso',
      value: 'Persona Natural',
      type: 'text',
    },
    {
      mainKey: 'Tipo cliente',
      value: 'Residencial',
      type: 'text',
    },
    {
      mainKey: 'Inmueble',
      value: 'Casa',
      type: 'text',
    },
  ];

  typeContent: any;

  ngOnInit(): void {
    this.verifyTypeContent();
  }

  verifyTypeContent() {
    if (Array.isArray(this.content)) {
      this.typeContent = TypeContent.isArray;
    } else if (typeof this.typeContent === 'object') {
      this.typeContent = TypeContent.isObject;
    } else {
      this.typeContent = TypeContent.isText;
    }
  }
}
