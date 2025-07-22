import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@verisure/services';
import { MessageEscComponent } from '@verisure/ui';

@Component({
  selector: 'verisure-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, MessageEscComponent],
})
export class UnauthorizedComponent implements OnInit {
  constructor(private authSerivce: AuthService, private $router: Router) {}
  ngOnInit(): void {
    this.authSerivce.login();
  }
  clearStorage() {
    localStorage.clear();
  }
}
