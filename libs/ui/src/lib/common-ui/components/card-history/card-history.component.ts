import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TinyCardComponent } from '../tiny-card/tiny-card.component';
import { ButtonComponent } from '../button/button.component';
import { AlertComponent } from '../alert/alert.component';
import { enterStateAnimation } from '../../animations/enterState';
import { SafePipe } from '../../pipe/safe.pipe';

@Component({
  selector: 'verisure-card-history',
  standalone: true,
  templateUrl: './card-history.component.html',
  styleUrls: ['./card-history.component.scss'],
  imports: [
    CommonModule,
    TinyCardComponent,
    ButtonComponent,
    AlertComponent,
    SafePipe,
  ],
  encapsulation: ViewEncapsulation.None,
  animations: [enterStateAnimation],
})
export class CardHistoryComponent implements OnInit {
  @Input() content: any;
  offersArr: Array<any> = [];
  @Output() toFullOffer = new EventEmitter();
  @Output() toResumeOffer = new EventEmitter();

  urlIcon!: string;
  windowCurrentWidth!: number;

  @HostListener('window:resize', ['$event.target'])
  onResize(event: any) {
    this.windowCurrentWidth = event.innerWidth;
  }

  ngOnInit(): void {
    console.log('Content into verisure-card-history: ', this.content);
    if (this.content.usuario.name) {
      this.content.usuario.name = this.content.usuario.name.trim();
    }
    this.urlIcon =
      this.content.usuario.type === 'RP'
        ? 'assets/icons/icon-natural-user.svg'
        : 'assets/icons/icon-bussiness-user.svg';
    this.windowCurrentWidth = window.innerWidth;

    this.formatOffers();
  }

  formatOffers() {
    const ofertas = [...this.content.ofertas];
    const newOfferArr = ofertas.map((offer) => {
      return {
        ofertaId: offer.id || '',
        ofertaProspecto: offer.prospecto ? offer.prospecto : '',
        ofertaFecha: {
          type: 'date',
          value: this.formatFechaCreacion(offer.fechaCreacion),
        },
        ofertaPrecio: offer.descripcion ? offer.descripcion : '',
      };
    });

    this.offersArr = newOfferArr;
  }

  formatFechaCreacion(fecha: string): string {
    // const onlyDate = fecha.split(' ')[0];
    // return onlyDate.split('-').reverse().join('/');

    const today = new Date(fecha);
    today.setDate(today.getDate());

    const yyyy = today.getFullYear();
    let mm: any = today.getMonth() + 1; // Months start at 0!
    let dd: any = today.getDate();

    if (dd < 10) dd = '0' + dd.toString();
    if (mm < 10) mm = '0' + mm.toString();
    return dd + '/' + mm + '/' + yyyy;
  }

  goToFullOffer(id: string) {
    this.toFullOffer.emit(id);
  }

  goToResumeOffer(id: string) {
    this.toResumeOffer.emit(id);
  }
}
