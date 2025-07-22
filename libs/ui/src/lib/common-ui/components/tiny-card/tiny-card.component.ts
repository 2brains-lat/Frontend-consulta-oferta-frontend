import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SizeT, SizeUnitT } from '../utils';

@Component({
  selector: 'verisure-tiny-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tiny-card.component.html',
  styleUrls: ['./tiny-card.component.scss'],
})
export class TinyCardComponent implements OnInit {
  @Input() icon = 'logo-verisure';
  @Input() label = 'No definido';
  @Input() width: SizeUnitT = '100%';
  @Input() size: SizeT = 'small';

  urlIcons!: string;
  windowCurrentWidth!: number;

  @HostListener('window:resize', ['$event.target'])
  ngOnInit(): void {
    this.urlIcons = `assets/icons/${this.icon}.svg`;
  }

  onResize(event: any) {
    this.windowCurrentWidth = event.innerWidth;
  }
}
