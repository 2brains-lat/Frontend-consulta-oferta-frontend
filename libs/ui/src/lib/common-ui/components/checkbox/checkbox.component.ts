import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { VariantT } from '../utils';

@Component({
  selector: 'verisure-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCheckboxModule, ReactiveFormsModule],
})
export class CheckboxComponent {
  @Input() form!: FormControl;
  @Input() disabled!: boolean;
  @Input() color: VariantT = 'primary';
}
