import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipe } from '../../pipe/safe.pipe';

@Component({
  selector: 'verisure-head-collapsible',
  standalone: true,
  imports: [CommonModule, SafePipe],
  templateUrl: './head-collapsible.component.html',
  styleUrls: ['./head-collapsible.component.scss'],
  // host: {
  //   '(window:resize)': 'onResize($event)',
  // },
})
export class HeadCollapsibleComponent implements OnInit {
  @Input() name = '';
  @Input() rut = '';
  @Input() type = 'natural';
  @Input() actionType: 'header-uncollapsible' | 'header-collapsible' =
    'header-collapsible';
  urlIcon!: string;
  windowCurrentWidth!: number;

  @HostListener('window:resize', ['$event.target'])
  onResize(event: any) {
    this.windowCurrentWidth = event.innerWidth;
  }

  toggleCollapsable(event: any) {
    event.preventDefault();
    const currentColl = event.target as HTMLElement;
    const content: any = currentColl?.parentElement?.nextElementSibling;

    currentColl.classList.toggle('active');
    currentColl?.parentElement?.parentElement?.nextElementSibling?.classList.toggle(
      'active'
    );
    currentColl?.parentElement?.parentElement?.classList.toggle('expanded');
    // content.style.display = event.open ? 'flex' : 'none';

    if (content.style.display === 'flex') {
      content.style.display = 'none';
    } else {
      content.style.display = 'flex';
    }
  }

  ngOnInit(): void {
    this.urlIcon =
      this.type === 'Primera Categoría'
        ? 'assets/icons/icon-natural-user.svg'
        : 'assets/icons/icon-bussiness-user.svg';
    this.windowCurrentWidth = window.innerWidth;
  }
}
