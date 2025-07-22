import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'verisure-alert',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
  @Input() type!:
    | 'success'
    | 'success-tiny'
    | 'warning'
    | 'error'
    | 'default'
    | 'information';

  @Input() label = 'Text default';
  @Input() url!: string;
  @Input() size: 'sm' | 'md' = 'md';
  @Input() urlIcons: string | null = null;
  urlArrowIcon!: string;

  ngOnInit(): void {
    if (this.urlIcons === null)
      this.urlIcons = `assets/icons/icon-${this.type}-alert.svg`;
  }
}
