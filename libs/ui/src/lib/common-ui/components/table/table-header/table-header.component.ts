import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'verisure-table-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TableHeaderComponent {
  @Input() headerList!: Array<string> | undefined;
}
