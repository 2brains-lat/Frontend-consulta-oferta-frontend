import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageEscComponent } from '@verisure/ui';

@Component({
  selector: 'verisure-faileddownload',
  templateUrl: './faileddownload.component.html',
  styleUrls: ['./faileddownload.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, MessageEscComponent],
})
export class FaileddownloadComponent {}
