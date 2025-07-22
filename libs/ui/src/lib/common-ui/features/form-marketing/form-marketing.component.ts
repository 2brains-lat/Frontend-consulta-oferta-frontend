import {
  Component,
  Input,
  Output,
  ViewEncapsulation,
  EventEmitter,
  OnInit,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../components/button/button.component';
import { RadioButtonComponent } from '../../components/radio-button/radio-button.component';
import { InputComponent } from '../../components/input/input.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { enterStateAnimation } from '../../animations/enterState';
import { formatearRut } from '../offers-to-offer/utils';
import { environment } from 'environments/environment';
import { MatOptionModule } from '@angular/material/core';
@Component({
  selector: 'verisure-form-marketing',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    RadioButtonComponent,
    InputComponent,
    ReactiveFormsModule,
    MatSelectModule,
    FormsModule,
    MatOptionModule,
  ],
  animations: [enterStateAnimation],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './form-marketing.component.html',
  styleUrls: ['./form-marketing.component.scss'],
})
export class FormMarketingComponent implements OnInit {
  errorMessage: any;
  @Input() tipoCliente!: { label: string; value: string | number }[];
  @Input()
  form!: FormGroup;
  @Input()
  comunas!: { value: string; label: string }[];
  screenWidth = 0;
  resetProspecto = true;
  get comunaSelectId(): string {
    return this._comunaSelectId;
  }
  set comunaSelectId(value: string) {
    this.form.get('idComuna')?.setValue(value.length === 0 ? null : value);
    this._comunaSelectId = value;
  }
  _comunaSelectId = '';

  @Output() Submit = new EventEmitter();
  ngOnInit() {
    this.initFormDisabledState();
    this.onFormValueChange();
    this.onFormRutChange();
    this.onResize();
  }
  onSubmit() {
    this.Submit.emit();
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  initFormDisabledState() {
    this.form.controls['tipoCliente'].disable({ emitEvent: false });
    this.form.controls['idComuna'].disable({ emitEvent: false });
  }

  onFormValueChange() {
    this.form.valueChanges.subscribe((e) => {
      this.form.controls['tipoCliente'].disable({ emitEvent: false });
      this.form.controls['idComuna'].disable({ emitEvent: false });
      if (this.form.get('rut')?.valid) {
        this.form.controls['tipoCliente'].enable({ emitEvent: false });
      } else {
        this.form.controls['idComuna'].setValue(null, { emitEvent: false });
        this.form.controls['tipoCliente'].setValue(null, { emitEvent: false });
      }
      if (this.form.get('tipoCliente')?.valid && this.form.get('rut')?.valid) {
        this.form.controls['idComuna'].enable({ emitEvent: false });
      }
    });
  }
  onFormRutChange() {
    this.form.get('rut')?.valueChanges.subscribe((value) => {
      const rutFormateado = formatearRut(value);
      this.form.controls['rut'].setValue(rutFormateado, { emitEvent: false });
      value = rutFormateado;
      if (this.form?.get('rut')?.valid) {
        const rut = value.replace(/\./g, '').trim();
        console.log('clean rut ', rut);
        if (!/^[0-9]+-[0-9kK]{1}$/.test(rut)) {
          return;
        }
        const tmp = rut.split('-');
        const numerosRut = tmp[0];
        this.form.get('segmento')?.setValue(null);
        if (Number(numerosRut) >= Number(environment.form.rango_rut)) {
          this.tipoCliente = this.tipoCliente.map((segmento) => {
            let disabled = false;
            if (
              segmento.value.toString() ===
              environment.form.id_segmento_residencia.toString()
            ) {
              disabled = true;
            }
            return {
              label: segmento.label,
              value: segmento.value,
              disabled,
            };
          });
        } else {
          this.tipoCliente = this.tipoCliente.map((segmento) => {
            const disabled = false;
            return {
              label: segmento.label,
              value: segmento.value,
              disabled,
            };
          });
        }
      }
    });
    this.onResize();
  }
}
