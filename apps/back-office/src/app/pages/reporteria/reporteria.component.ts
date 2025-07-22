import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'environments/environment';
import {
  DomSanitizer,
  SafeResourceUrl,
  Title,
} from '@angular/platform-browser';

@Component({
  selector: 'verisure-reporteria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reporteria.component.html',
  styleUrls: ['./reporteria.component.scss'],
})
export class ReporteriaComponent {
  reporteria_url!: SafeResourceUrl;
  constructor(private sanitizer: DomSanitizer, private title: Title) {
    this.title.setTitle('Reportería | Back Office | Consulta oferta Verisure');
    this.reporteria_url = this.sanitizer.bypassSecurityTrustResourceUrl(
      environment.reporteria_url ??
        'https://app.powerbi.com/reportEmbed?reportId=266af76d-3f7e-4cad-b821-0c4c32f776e0&autoAuth=true&ctid=3055fa7f-a944-4927-801e-a62b63119e43'
    );
  }
}
