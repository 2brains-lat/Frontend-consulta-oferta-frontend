import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageEscComponent } from '@verisure/ui';

@Component({
  selector: 'verisure-successfuldownload',
  templateUrl: './successfuldownload.component.html',
  styleUrls: ['./successfuldownload.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule, MessageEscComponent],
})
export class SuccessfuldownloadComponent {}
