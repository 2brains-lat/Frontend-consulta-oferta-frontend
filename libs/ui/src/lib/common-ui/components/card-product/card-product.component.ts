import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'verisure-card-product',
  templateUrl: './card-product.component.html',
  styleUrls: ['./card-product.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class CardProductComponent {
  @Input() isActive = false;
  @Input() mode: 'wrapper' | 'extended' = 'extended';
  @Input() size: 'sm' | 'md' = 'md';
}
