import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ButtonComponent } from '../../../components/button/button.component';
import { InputComponent } from '../../../components/input/input.component';
import { datosAdicionalesT } from '../utils.type';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CardEmphasisComponent } from '../../../components/card-emphasis/card-emphasis.component';
import { CardItemComponent } from '../../../components/card-item/card-item.component';
import { AlertComponent } from '../../../components/alert/alert.component';
import { CheckboxComponent } from '../../../components/checkbox/checkbox.component';

@Component({
  selector: 'verisure-screen-descuentos',
  templateUrl: './screen-descuentos.component.html',
  styleUrls: ['./screen-descuentos.component.scss'],
  imports: [
    CommonModule,
    InputComponent,
    ButtonComponent,
    MatCheckboxModule,
    ReactiveFormsModule,
    CardEmphasisComponent,
    CardItemComponent,
    AlertComponent,
    CheckboxComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class ScreenDescuentosComponent implements OnInit {
  @Input() actualDiscount!: datosAdicionalesT | undefined;
  @Input() myForm: FormControl = new FormControl('');
  @Output() callback = new EventEmitter();
  @Input() cuponState!: boolean;
  @Input() readMode!: boolean;
  ngOnInit() {
    this.myForm.setValue(this.cuponState);

    this.myForm.valueChanges.subscribe((e) => {
      this.callback.emit(e);
    });
    if (this.readMode) {
      this.myForm.disable();
    }
  }

  percentFormat(value: number): string {
    return value + '%';
  }
}
