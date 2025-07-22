import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageEscComponent } from '@verisure/ui';

@Component({
  selector: 'verisure-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  imports: [CommonModule, RouterModule, MessageEscComponent],
  standalone: true,
})
export class NotFoundComponent {}
