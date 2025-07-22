import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@verisure/services';

import { ButtonComponent } from '../../components/button/button.component';
import { SafePipe } from '../../pipe/safe.pipe';

@Component({
  selector: 'verisure-message-esc',
  templateUrl: './message-esc.component.html',
  styleUrls: ['./message-esc.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonComponent, SafePipe],
  encapsulation: ViewEncapsulation.None,
})
export class MessageEscComponent {
  @Input() iconSvgUrl!: string;
  @Input() textContent!: { title: string; content: string };
  @Input() buttonContent!: { label: string; path: string };
  constructor(private $router: Router, private authService: AuthService) {}
  onClickButton() {
    console.log('clicked');

    if (this.buttonContent?.path === '') {
      window.location.href = '/';
    } else if (this.buttonContent?.path === 'logout') {
      this.authService.logOut();
      return;
    } else if (this.buttonContent?.path === 'login') {
      window.location.href = '/';
      return;
    } else {
      this.$router?.navigate([this.buttonContent?.path]);
    }
  }
}
