import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'verisure-maestros-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './maestros-layout.component.html',
  styleUrls: ['./maestros-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MaestrosLayoutComponent {
  @Input() navSubitemName!: string;
  @Input() itemTabSelectedName!: string;
  titleTabSelectedName!: string;

  formatTitle(tabName: string): string {
    if (tabName === 'producto') {
      return 'Producto (Kit y Packs)';
    } else {
      return tabName.charAt(0).toUpperCase() + tabName.slice(1);
    }
  }
}
