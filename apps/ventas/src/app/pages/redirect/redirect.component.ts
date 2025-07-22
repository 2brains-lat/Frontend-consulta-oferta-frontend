import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LoaderService } from '@verisure/services';
import { MessageEscComponent } from '@verisure/ui';

@Component({
  selector: 'verisure-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, MessageEscComponent],
})
export class RedirectComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private loaderService: LoaderService
  ) {}
  ngOnInit() {
    this.loaderService.show('Te redirigiremos, por favor espera un momento');
    this.route.fragment
      .subscribe((fragment) => {
        console.log('FRAGMENTO!! ' + '/' + fragment + '/');
        if (fragment) {
          window.location.href = '/' + fragment + '/';
        }
      })
      .add(() => this.loaderService.hide());
    return;
  }
}
