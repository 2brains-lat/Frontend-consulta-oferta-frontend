/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { SafePipe } from '../../pipe/safe.pipe';
import { NavLinksContent } from '../utils';
import { opacityAnimation } from '../../animations/enterState';

@Component({
  selector: 'verisure-list-menu',
  standalone: true,
  imports: [CommonModule, MatListModule, RouterModule, SafePipe],
  templateUrl: './list-menu.component.html',
  styleUrls: ['./list-menu.component.scss'],
  animations: [opacityAnimation],
  encapsulation: ViewEncapsulation.None,
})
export class ListMenuComponent {
  @Input() items: NavLinksContent = [
    {
      path: '/',
      label: 'Inicio',
      iconUrl: '',
      activeIconUrl: '',
    },
  ];
  //refactorizar esto ! *ELIMINAR
  @Output() toggle = new EventEmitter();
  @Output() closeSession = new EventEmitter();
  @Output() subMenuFilter = new EventEmitter();
  //
  currentDropDownStatus!: number | null;
  InputSelected: string | null = null;
  onDropDownSubMenu(value: number) {
    // eliminar closer funcion
    if (value === null) {
      close();
      return;
    }
    //
    if (this.currentDropDownStatus == value) {
      this.currentDropDownStatus = null;
      close();
      return;
    }
    this.currentDropDownStatus = value;
    close();
  }
  mouseEnter(id: string) {
    this.InputSelected = id;
  }
  mouseLeave(id: string) {
    if (this.InputSelected === id) {
      this.InputSelected = null;
    }
  }
  // refactorizar esto ! *ELIMINAR
  close = () => {
    this.toggle.emit();
  };
  toggleSubMenuFilter(nameSubFilter: string) {
    this.subMenuFilter.emit(nameSubFilter);
  }
  //
}
