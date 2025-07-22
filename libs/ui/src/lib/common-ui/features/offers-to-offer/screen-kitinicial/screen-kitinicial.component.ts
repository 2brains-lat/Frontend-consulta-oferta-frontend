import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  OnInit,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { CardEmphasisComponent } from '../../../components/card-emphasis/card-emphasis.component';
import { AlertComponent } from '../../../components/alert/alert.component';

import { RadioButtonComponent } from '../../../components/radio-button/radio-button.component';
import { TabComponent } from '../../../components/tab/tab.component';
import { DetalleOfferT, productListT } from '../utils.type';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CardProductComponent } from '../../../components/card-product/card-product.component';
import { TinyCardComponent } from '../../../components/tiny-card/tiny-card.component';
import * as _ from 'underscore';

@Component({
  selector: 'verisure-screen-kitinicial',
  templateUrl: './screen-kitinicial.component.html',
  styleUrls: ['./screen-kitinicial.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RadioButtonComponent,
    TabComponent,
    MatRadioModule,
    AlertComponent,
    ReactiveFormsModule,
    CardEmphasisComponent,
    MatCheckboxModule,
    CardProductComponent,
    TinyCardComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class ScreenKitinicialComponent {
  myForm: FormGroup = new FormGroup('');
  alertContent = '';
  @Input() offerHavePacks = false;
  haveDiscount = false;
  @Input() readMode = false;
  firstLoad = true;
  @Input()
  set productsList(value: productListT[] | null | undefined) {
    if (this.selectedKit !== null && this.productsList !== null) {
      this.authorizationList = this.getAuthorizationList();
    }
    this._productsList = value ?? [];
  }
  get productsList(): productListT[] {
    return this._productsList;
  }
  private _productsList!: productListT[];
  @Output() paycodeSelected = new EventEmitter();
  @Output()
  authorizationSelected = new EventEmitter();
  @Input()
  set authorizationList(value: { value: string; label: string }[]) {
    this._authorizationList = _.sortBy(value, 'value');
  }
  get authorizationList(): { value: string; label: string }[] {
    return this._authorizationList;
  }
  _authorizationList!: { value: string; label: string }[];
  @Input()
  set authorizationSelectedValue(value: string) {
    console.log(value, ' on authorizationSelectedValue');
    this._authorizationSelectedValue = value;
    if (value && value !== null && this.selectedKit !== null) {
      this.pricing = this.filterList().sort((a: any, b:any) => {
        return b.montoInstalacion - a.montoInstalacion;
      });
      console.log("this.pricing");
      console.log(this.pricing);
    }
  }
  get authorizationSelectedValue(): string {
    return this._authorizationSelectedValue;
  }
  private _authorizationSelectedValue!: string;
  @Input()
  set selectedKit(value: string | null | number) {
    this._selectedKit = value;
    if (value && value !== null) {
      console.log(
        'SET SELECTEDKIT , THIS.PRODUCTLIST ',
        this.productsList,
        value.toString()
      );
      const _paycodeSelected = this.productsList.filter(
        (product) => product.idProducto.toString() === value.toString()
      )[0].paycodeList[0].value;

      this.paycodeSelectedValue = _paycodeSelected;
    }
  }
  get selectedKit(): string | null | number {
    return this._selectedKit;
  }
  private _selectedKit: string | null | number = null;
  @Input()
  set paycodeSelectedValue(value: string) {
    if (value) {
      this._paycodeSelectedValue = value.toString() ?? 'PAC';
      this.paycodeSelected.emit(value.toString() ?? 'PAC');
      if (
        (value && value !== null) ||
        this.selectedKit !== null ||
        this.selectedKit !== undefined
      ) {
        this.authorizationList = this.getAuthorizationList();
      }
    }
  }
  get paycodeSelectedValue(): string {
    return this._paycodeSelectedValue;
  }
  private _paycodeSelectedValue = '';
  @Output() priceSelectedOutPut = new EventEmitter();
  @Input()
  set priceSelected(value: string | null | number) {
    const $kitSelected = value !== null ? value.toString().split('---')[0] : '';
    const $priceSelected =
      value !== null ? value.toString().split('---')[1] : '';
    console.log(value + ' pn priceSelected');
    if (
      this._priceSelected === null &&
      value !== null &&
      this.selectedKit !== $kitSelected
    ) {
      this.haveDiscount = false;
      this._selectedKit = $kitSelected;
      const detalle = this.productsList
        .filter(
          (producto) => producto.idProducto.toString() === $kitSelected
        )[0]
        ?.detalleOferta.filter((detalle) => {
          this.haveDiscount = detalle.datosAdicionales.permiteCupon ?? false;
          return detalle.idDetalleOferta.toString() === $priceSelected;
        })[0];
      console.log(detalle, ' have detail on priceSelected');
      if (detalle) {
        this.paycodeSelectedValue = detalle.medioPagoMonitoreo[0];
        console.log(
          detalle.autorizacionId.toString(),
          ' have autorizacionId on priceSelected'
        );
        this.authorizationSelected.emit(detalle.autorizacionId.toString());
        this.authorizationSelectedValue = detalle.autorizacionId.toString();
      }
    }
    if (
      (this._priceSelected !== value && this._priceSelected !== undefined) ||
      value === null
    ) {
      this.priceSelectedOutPut.emit(value);
    }
    this._priceSelected = value;
  }
  get priceSelected(): string | null | number {
    return this._priceSelected;
  }
  private _priceSelected: string | null | number = null;

  pricing!: DetalleOfferT[];
  reset = true;
  ngOninit() {
    this.reset = false;
    setTimeout(() => {
      this.reset = true;
    }, 100);
  }
  ngOnDestroy() {
    this.reset = false;
  }

  replaceDotWithComma = (float: number | string) =>
    float.toString().replace(/\./g, ',');

  getAuthorizationList() {
    const newList: { value: string; label: string }[] = [];
    console.log(
      'antes de crear lista de autorizacion ',
      this.selectedKit?.toString(),
      this.paycodeSelectedValue
    );
    const thisKit = this.productsList.filter(
      (product) =>
        product.idProducto.toString() === this.selectedKit?.toString()
    )[0];
    thisKit.detalleOferta.map((detalle) => {
      if (
        !newList.find(
          (list) => list.value === detalle.autorizacionId.toString()
        ) &&
        detalle.medioPagoMonitoreo.includes(this.paycodeSelectedValue)
      ) {
        newList.push({
          value: detalle.autorizacionId.toString(),
          label: detalle.autorizacion,
        });
      }
    });
    if (this.selectedKit) {
      let _paycodeSelected = '0';
      console.log(
        'KIT SELECTED, AND KIT OF MY PRICE',
        this.selectedKit,
        this.priceSelected?.toString().split('---')[0]
      );
      if (
        this.priceSelected &&
        this.selectedKit === this.priceSelected.toString().split('---')[0]
      ) {
        console.log(
          ' price id ',
          thisKit.detalleOferta,
          this.priceSelected?.toString().split('---')[1]
        );
        _paycodeSelected =
          thisKit.detalleOferta
            .filter(
              (e) =>
                e.idDetalleOferta.toString() ===
                this.priceSelected?.toString().split('---')[1].toString()
            )[0]
            .autorizacionId?.toString() ?? 0;
      } else {
        // every time we change screen this will show you the selected kid
        if (!this.firstLoad) {
          _paycodeSelected = _.sortBy(newList, 'value')[0].value;
        }
      }
      this.authorizationSelected.emit(_paycodeSelected);
      this.authorizationSelectedValue = _paycodeSelected;
      this.firstLoad = false;
    }

    return newList;
  }
  filterList() {
    if (this.authorizationSelectedValue == null) return [];

    return this.productsList
      .filter(
        (product) =>
          product.idProducto.toString() === this.selectedKit?.toString()
      )[0]
      .detalleOferta.filter((detalleOferta) =>
        detalleOferta.medioPagoMonitoreo.includes(
          this.paycodeSelectedValue.toString()
        )
      )
      .filter(
        (detalleOferta) =>
          detalleOferta.autorizacionId.toString() ===
          this.authorizationSelectedValue.toString()
      );
  }
  onClickRadio(event: any) {
    if (event.target.defaultValue === undefined) return;
    if (
      this.selectedKit !== null &&
      event.target.defaultValue?.toString() === this.selectedKit?.toString()
    ) {
      this.selectedKit = null;
      return;
    }
    if (this.selectedKit == null) {
      this.selectedKit = event.target.defaultValue.toString();
      return;
    }
  }
  onClickPriceRadio(event: any) {
    if (event.target.defaultValue === undefined) return;
    if (
      this.priceSelected !== null &&
      event.target.defaultValue?.toString() === this.priceSelected?.toString()
    ) {
      this.priceSelected = null;
      return;
    }
    if (this.priceSelected == null) {
      this.priceSelected = event.target.defaultValue?.toString();
      return;
    }
  }
  alertContentHtml(content: string): string {
    return `
      Esta oferta <strong>no considera: </strong>
   <div class='padding-left12'>
    ${content}
    </div>
    
    `;
  }
  replaceThis(element: string, oldCharacter: any, newCharacter: any) {
    const searchRegExp = new RegExp(oldCharacter, 'g');
    return element.replace(searchRegExp, newCharacter);
  }
  formatPrice(price: number) {
    const format = new Intl.NumberFormat('es-CL', {
      currency: 'CLP',
      style: 'currency',
    });
    return format.format(price);
  }
  formatDate(isoDate: string) {
    const ISODateString = new Date(isoDate).toISOString();
    const options: Intl.DateTimeFormatOptions = {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    };
    const date = new Date(ISODateString);
    const chileDate = new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    );
    return new Intl.DateTimeFormat('es-CL', options)
      .format(chileDate)
      .replace(/-/g, '/');
  }
  //set , get
  isKitPriceSelected(
    kitSelected: string | number,
    priceSelected: string | number | null
  ) {
    if (priceSelected == null) return false;
    return (
      kitSelected?.toString() ===
      priceSelected?.toString().split('---')[0].toString()
    );
  }
}
