import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TinyCardComponent } from '../tiny-card/tiny-card.component';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { RequestStatusAlertService } from '@verisure/services';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'verisure-card-offer-info',
  standalone: true,
  templateUrl: './card-offer-info.component.html',
  styleUrls: ['./card-offer-info.component.scss'],
  imports: [CommonModule, TinyCardComponent, ButtonComponent],
})
export class CardOfferInfoComponent implements OnInit {
  @Input() idOffer!: string;
  @Input() delegation!: string;
  @Input() dateStart!: string;
  @Input() dateEnd!: string;
  constructor(public requestStatusService: RequestStatusAlertService) {}
  ngOnInit(): void {
    console.log('INTO: CardOfferInfoComponent');
  }
  copyToClipboard() {
    const copyText = document.createElement('textarea');
    copyText.value = window.location.toString();
    document.body.appendChild(copyText);
    copyText.select();
    document.execCommand('copy');
    document.body.removeChild(copyText);
    this.requestStatusService.success({
      status: 200,
      message: 'Enlace copiado exitosamente!',
    });
  }
  formatDate(isoDate: string) {
    console.log('FORM DATE ', isoDate, new Date(isoDate.toString()));
    const date = new Date(isoDate.toString());

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().substr(-2);

    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate; // Output: 31-03-23
  }
}
