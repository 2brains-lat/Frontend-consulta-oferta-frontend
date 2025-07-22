import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'verisure-card-emphasis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-emphasis.component.html',
  styleUrls: ['./card-emphasis.component.scss'],
})
export class CardEmphasisComponent {
  @Input() active = false;

  // @Input('typeContent') typeContent: string = 'kit';

  public checked!: boolean;
  public value!: any;

  onChange(value: any) {
    const hasData = value === '';
  }
}
