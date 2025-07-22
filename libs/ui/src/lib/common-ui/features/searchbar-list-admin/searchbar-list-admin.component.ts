import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { InputComponent } from '../../components/input/input.component';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'verisure-searchbar-list-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './searchbar-list-admin.component.html',
  styleUrls: ['./searchbar-list-admin.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SearchbarListAdminComponent implements OnInit {
  @Input() onChangeTab = '';
  @Input() titleButtonAdd = '';
  @Input() toggleFilters = false;
  windowCurrentWidth!: number;

  @Input() formBarSearch!: FormGroup;
  @Input() disableButtonAdd = false;
  @Input() showFilter = true;
  @Output() clickItem: EventEmitter<any> = new EventEmitter();
  @Output() searchEvent: EventEmitter<any> = new EventEmitter();

  @ViewChild('filterdropdown', { static: true }) sidevar!: MatSidenav;

  @HostListener('window:resize', ['$event.target'])
  onResize(event: any) {
    this.windowCurrentWidth = event.innerWidth;
  }

  constructor(public fb: FormBuilder) {}

  ngOnInit(): void {
    this.windowCurrentWidth = window.innerWidth;
  }

  getNewSearch(event: any) {
    console.log('event to search: ', event);
    this.searchEvent.emit(event);
  }

  addItem() {
    this.clickItem.emit('add');
  }

  public isOpenedFilter(): boolean {
    return this.sidevar.opened;
  }

  public toggle() {
    this.sidevar.toggle();
  }
}
