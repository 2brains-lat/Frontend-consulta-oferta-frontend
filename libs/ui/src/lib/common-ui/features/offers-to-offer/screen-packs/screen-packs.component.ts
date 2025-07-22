import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardEmphasisComponent } from '../../../components/card-emphasis/card-emphasis.component';

import { CardProductComponent } from '../../../components/card-product/card-product.component';
import { TinyCardComponent } from '../../../components/tiny-card/tiny-card.component';
import { AlertComponent } from '../../../components/alert/alert.component';
import { productListT } from '../utils.type';
@Component({
  selector: 'verisure-screen-packs',
  imports: [
    CommonModule,
    CardEmphasisComponent,
    CardProductComponent,
    TinyCardComponent,
    AlertComponent,
  ],

  templateUrl: './screen-packs.component.html',
  styleUrls: ['./screen-packs.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class ScreenPacksComponent {
  iconPacks = 'assets/icons/icon-packs.svg';
  @Input()
  packsInfo!: productListT[];
  @Input() showNodes = false;

  formatPrice = (price: number | string) =>
    new Intl.NumberFormat('es-CL', {
      currency: 'CLP',
      style: 'currency',
    }).format(Number(price));
  replaceThis(element: string, oldCharacter: any, newCharacter: any) {
    const searchRegExp = new RegExp(oldCharacter, 'g');
    return element.replace(searchRegExp, newCharacter);
  }
  replaceDotWithComma = (float: number | string) =>
    float.toString().replace(/\./g, ',');

  formatDate(isoDate: string) {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().substr(-2);
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate; // Output: 31-03-23
  }
}
