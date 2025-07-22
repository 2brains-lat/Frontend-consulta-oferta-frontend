import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListMenuComponent } from '../list-menu/list-menu.component';

@Component({
  selector: 'verisure-sidebar',
  standalone: true,
  imports: [CommonModule, ListMenuComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {}
