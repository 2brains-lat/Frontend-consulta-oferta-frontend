import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { RoutingService } from '@verisure/services';

@Component({
  selector: 'verisure-back',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './back.component.html',
  styleUrls: ['./back.component.scss'],
})
export class BackComponent implements OnInit {
  @Input() label = 'Volver';

  urlArrowIcon = '../../../../assets/icons/arrow-right-icon.svg';
  previousUrl!: string;
  currentUrl!: string;

  constructor(private router: Router, private routingService: RoutingService) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.previousUrl = this.routingService.getPreviousUrl;
  }
}
