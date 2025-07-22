import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { NavLinksContent } from '../utils';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'verisure-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  @Output() toggle = new EventEmitter();
  // @Input()
  // items:NavLinksContent= [{ label: 'Home', path: '/' }];
  onMenuClick(value: unknown) {
    // console.log(value);
    this.toggle.emit();
  }
}
