import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { AuthService, LoaderService } from '@verisure/services';
import { environment } from 'environments/environment';
import { CardItemComponent } from '../../components/card-item/card-item.component';
import { TinyCardComponent } from '../../components/tiny-card/tiny-card.component';
import { ResultadoconsultaLayoutComponent } from '../../layouts/resultadoconsulta-layout/resultadoconsulta-layout.component';
import { NextStepComponent } from '../offers-to-offer/next-step/next-step.component';
import { ScreenDescuentosComponent } from '../offers-to-offer/screen-descuentos/screen-descuentos.component';
import { ScreenKitinicialComponent } from '../offers-to-offer/screen-kitinicial/screen-kitinicial.component';
import { ScreenPacksComponent } from '../offers-to-offer/screen-packs/screen-packs.component';
import { capitalizeFullName, formatearRut } from '../offers-to-offer/utils';
import { ResumenT } from '../offers-to-offer/utils.type';

@Component({
	selector: 'verisure-offert-review',
	templateUrl: './offert-review.component.html',
	styleUrls: ['./offert-review.component.scss'],
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	imports: [
		CommonModule,
		ScreenKitinicialComponent,
		TinyCardComponent,
		CardItemComponent,
		ScreenDescuentosComponent,
		ScreenPacksComponent,
		NextStepComponent,
		ResultadoconsultaLayoutComponent
	]
})
export class OffertReviewComponent implements OnDestroy {
	@Input() kitList!: any;
	@Input() clientData!: any;
	@Input() packList!: any;
	@Input() dataStatus: any;
	@Input() equifax!: any;
	@Input() seller!: any;
	@Input() offerData!: offerDataT | null;
	@Input()
	infoOfertaOfrecida!: ResumenT | null;
	@Input() priceSelected: any;
	@Input() priceSelectedInfo: any;
	@Input() cuponCurrentState: any;
	paycodeSelected!: string;
	authorizationSelected!: string;
	constructor(
		private loaderService: LoaderService,
		private router: Router,
		private authService: AuthService
	) {}
	public clearData() {
		this.paycodeSelected = '';
		this.authorizationSelected = '';
	}
	ngOnDestroy() {
		this.clearData();
	}
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
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');
		const seconds = date.getSeconds().toString().padStart(2, '0');
		const formattedDate = `${day}-${month}-${year} a las ${hours}:${minutes}:${seconds}`;
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
	getPdf = () => {
		this.loaderService.show('Generando PDF, por favor espera un momento');
		this.authService.currentAuthToken
			.then((token) => {
				const url =
					environment.apigateway_url +
					'/generatePdf?idOferta=' +
					this.offerData?.id.toString() +
					'&code=' +
					token;
				const headerName = 'content-type';
				const headerValue = 'application/pdf';
				const headers = new Headers();
				headers.append(headerName, headerValue);
				fetch(url, {
					headers: headers,
					method: 'GET'
				})
					.then((response) => response.blob())
					.then((blob) => {
						const objectURL = URL.createObjectURL(blob);
						window.open(objectURL, '_blank');
						this.loaderService.hide();
						this.router.navigate(['auditoria']);
					});
			})
			.catch(() => {
				this.loaderService.hide();
				this.router.navigate(['Oops']);
			});
	};
}

type offerDataT = {
	id: number;
	fechaDeCreacion: string;
	fechaDeVencimiento: string;
	delegacion: string;
};
