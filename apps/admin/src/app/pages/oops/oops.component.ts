import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MessageEscComponent } from '@verisure/ui';

@Component({
  selector: 'verisure-oops',
  templateUrl: './oops.component.html',
  styleUrls: ['./oops.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, MessageEscComponent],
})
export class OopsComponent {
  constructor(private title: Title) {
    this.title.setTitle('OCURRIO UN ERROR! Admin | Consulta oferta Verisure');
  }
}
