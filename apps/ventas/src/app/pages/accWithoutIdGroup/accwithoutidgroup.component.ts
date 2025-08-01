import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@verisure/services';
import { MessageEscComponent } from '@verisure/ui';

@Component({
  selector: 'verisure-accwithoutidgroup',
  templateUrl: './accwithoutidgroup.component.html',
  styleUrls: ['./accwithoutidgroup.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, MessageEscComponent],
})
export class accWithoutIdGroupComponent implements OnInit {
  content: string = '';
  constructor(private authSerivce: AuthService) {
    // this.content = `<p style="line-height: 32px;padding: 0px;margin: 0px;"> Contáctanos en Soporte MyIT <a href="https://securitasdirect-myit.onbmc.com" target="_blank"> https://securitasdirect-myit.onbmc.com </a> <br> 📞 223464848</p>`
    this.content = `<p class="contact-support"> Contáctanos en Soporte MyIT <a href="https://securitasdirect-myit.onbmc.com" target="_blank"> https://securitasdirect-myit.onbmc.com </a></p> <p class="contact-support-phone">📞 223464848</p>`
  }

  ngOnInit(): void {
    this.clearStorage();
    this.authSerivce.login();
  }
  clearStorage() {
    localStorage.clear();
    sessionStorage.clear();
  }
}
