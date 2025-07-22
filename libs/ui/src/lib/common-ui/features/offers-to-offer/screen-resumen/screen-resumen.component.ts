import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation, Input } from '@angular/core';

import { AlertComponent } from '../../../components/alert/alert.component';
import { ButtonComponent } from '../../../components/button/button.component';
import { CardItemComponent } from '../../../components/card-item/card-item.component';
import { capitalizeFullName, formatearRut } from '../utils';
import { ResumenT } from '../utils.type';

@Component({
	selector: 'verisure-screen-resumen',
	templateUrl: './screen-resumen.component.html',
	styleUrls: ['./screen-resumen.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		CardItemComponent,
		ButtonComponent,
		AlertComponent
	],
	encapsulation: ViewEncapsulation.None
})
export class ScreenResumenComponent {
	@Input()
	infoOfertaOfrecida!: ResumenT;
	@Input() rut!: string;

	// pend: transform in a util  function
	formatPrice = (price: number) =>
		new Intl.NumberFormat('es-CL', {
			currency: 'CLP',
			style: 'currency'
		}).format(price);
	formatDate(isoDate: string) {
		const date =
			isoDate && isoDate?.length > 0
				? new Date(isoDate)
				: new Date(Date.now() + 23123231);
		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const year = date.getFullYear().toString().substr(-2);
		const formattedDate = `${day}-${month}-${year}`;
		return formattedDate; // Output: 31-03-23
	}
	replaceDotWithComma = (float: number | string) =>
		float.toString().replace(/\./g, ',');

	formatearRut(rut: string): string {
		return formatearRut(rut);
	}
	capitalizeFullName(name: string): string {
		return capitalizeFullName(name);
	}
}
