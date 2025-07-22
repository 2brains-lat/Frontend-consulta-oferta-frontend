/* eslint-disable @angular-eslint/no-output-on-prefix */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VariantT, SizeT, SizeUnitT } from '../utils';

@Component({
  selector: 'verisure-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  @Input() variant: VariantT = 'accent';
  @Input() size: SizeT = 'medium';
  @Input() width: SizeUnitT = '100%';
  @Input() type = 'button';
  @Input() onlyIcon = false;
  @Input() disabled = false;
  @Output() onClick = new EventEmitter();
  callBack = () => {
    this.onClick.emit();
  };
}
