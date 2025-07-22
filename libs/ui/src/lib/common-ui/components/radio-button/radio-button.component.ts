/* eslint-disable @angular-eslint/no-output-on-prefix */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatRadioModule,
  MAT_RADIO_DEFAULT_OPTIONS,
} from '@angular/material/radio';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { SizeUnitT } from '../utils';
import { CardEmphasisComponent } from '../card-emphasis/card-emphasis.component';

@Component({
  selector: 'verisure-radio-button',
  standalone: true,
  imports: [
    CommonModule,
    MatRadioModule,
    FormsModule,
    CardEmphasisComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
  ],
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
  providers: [
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    },
  ],
})
export class RadioButtonComponent {
  @Input() items!: {
    label: string;
    value: string | number;
    description?: string;
    disabled?: boolean;
  }[];
  selected = '';
  stateChanges = new Subject<void>();
  @Input() type = 'input';
  @Input()
  set label(value: string) {
    this._label = value;
    this.stateChanges.next();
  }
  get label() {
    return this._label;
  }
  private _label = '';
  @Input()
  set direction(value: 'column' | 'row') {
    this._direction = value;
    this.stateChanges.next();
  }
  get direction() {
    return this._direction;
  }
  private _direction: 'column' | 'row' = 'column';

  @Input()
  set gap(value: SizeUnitT) {
    this._gap = value;
    this.stateChanges.next();
  }
  get gap() {
    return this._gap;
  }
  private _gap: SizeUnitT = '2px';
  @Input()
  radioModel!: string | number | null;
  @Output() onChange = new EventEmitter<string | number | null>();

  @Input()
  set control(value: FormControl) {
    if (this._formControl !== value) {
      this._formControl = value;
    }
  }
  get control() {
    return this._formControl;
  }
  private _formControl: FormControl = new FormControl('');
  change(event: any) {
    // if (event === undefined) return;
    // console.log(event.value, this.radioModel);
    // if (event.value === this.radioModel) {
    //   this.onChange.emit(null);
    //   return;
    // }

    this.onChange.emit(event.value);
  }
  onClick(event: any) {
    if (event.target.defaultValue === this.radioModel) {
      this.onChange.emit(null);
    }
    return;
  }
}
