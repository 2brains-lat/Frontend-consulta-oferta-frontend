import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { enterLeaveAlertAnimation, enterStateAnimation } from '@verisure/ui';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'verisure-maestros-oferta',
  templateUrl: './maestros-oferta.component.html',
  styleUrls: ['./maestros-oferta.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [enterLeaveAlertAnimation, enterStateAnimation],
})
export class MaestrosOfertaComponent {
  tabItems = [
    { value: 'producto', label: 'Producto' },
    { value: 'precio', label: 'Precio' },
    { value: 'condiciones', label: 'Condiciones' },
  ];

  title = 'Producto (Kit y Packs)';
  tabItemSelected = 'producto';

  constructor(public fb: FormBuilder, private titleHead: Title) {
    this.titleHead.setTitle(
      'Maestro Oferta | Admin | Consulta oferta Verisure'
    );
  }

  changeTap(data: any) {
    this.title = data === 'producto' ? 'Producto (Kit y Packs)' : data;
    this.tabItemSelected = data;
  }
}
