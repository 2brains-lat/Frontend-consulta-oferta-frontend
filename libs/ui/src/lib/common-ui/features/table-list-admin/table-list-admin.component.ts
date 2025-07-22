import {
  Component,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../components/button/button.component';
import { InputComponent } from '../../components/input/input.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableHeaderComponent } from '../../components/table/table-header/table-header.component';

const HEADER_TABLE_TITLES = [
  {
    name: 'producto',
    titles: [
      'Descripción',
      'Tipo ítem',
      'Subtipo',
      'ID VS',
      'ID VS Supercuota',
      'Estado',
      'Editar',
    ],
  },
  {
    name: 'precio',
    titles: [
      'Descripción',
      'ID VS',
      'Tipo ítem',
      'Categoría',
      'Precio instalación',
      'Tipo cuota',
      'Precio monitorieo',
      'ID MR',
      'Estado',
      'Editar',
    ],
  },
  {
    name: 'condiciones',
    titles: [
      'Descripción',
      'Medio de pago instalación',
      'Cupón',
      'Descuento Monitoreo',
      'Porcentaje Descuento Monitoreo',
      'Meses Descuento Monitoreo',
      'ID MR',
      'Estado',
      'Editar',
    ],
  },
];

@Component({
  selector: 'verisure-table-list-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    TableHeaderComponent,
  ],
  templateUrl: './table-list-admin.component.html',
  styleUrls: ['./table-list-admin.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TableListAdminComponent implements OnInit {
  @Input() onChangeTab!: string;
  @Input() navSubitemName!: string;

  windowCurrentWidth!: number;
  headerTableTitles: Array<string> | undefined = [];

  @HostListener('window:resize', ['$event.target'])
  onResize(event: any) {
    this.windowCurrentWidth = event.innerWidth;
  }

  constructor(public fb: FormBuilder) {}

  ngOnInit(): void {}
}
