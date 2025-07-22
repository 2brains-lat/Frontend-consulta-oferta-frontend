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
@Component({
  selector: 'verisure-form-consultarut',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    RadioButtonComponent,
    InputComponent,
    ReactiveFormsModule,
    MatSelectModule,
    FormsModule,
  ],
  animations: [enterStateAnimation],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './form-consultarut.component.html',
  styleUrls: ['./form-consultarut.component.scss'],
})
export class FormConsultarutComponent implements OnInit {
  errorMessage: any;
  @Input() recurso!: { label: string; value: string | number }[];
  @Input()
  segmentos!: { label: string; value: string | number }[];
  @Input()
  form!: FormGroup;
  @Input()
  inmuebles!: { key: string; value: string }[];
  @Input() inmueblesStatus = 0;
  screenWidth = 0;
  resetProspecto = true;

  @Output() Submit = new EventEmitter();
  // }
  ngOnInit() {
    this.onFormRecursoChange();
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

  prospectoLabel = (): string => {
    if (this.form?.controls['prospecto'] !== null) {
      this.form?.controls['prospecto'] &&
        this.form?.controls['prospecto']?.validator;
    }
    return `Ingresa N°Prospecto ${
      this.form?.controls['prospecto']?.validator?.arguments ? 'opcional' : ''
    }`;
  };
  initFormDisabledState() {
    this.form.controls['recurso'].disable({ emitEvent: false });
    this.form.controls['segmento'].disable({ emitEvent: false });
    this.form.controls['inmueble'].disable({ emitEvent: false });
    this.form.controls['prospecto'].disable({ emitEvent: false });
  }

  onFormValueChange() {
    this.form.valueChanges.subscribe((e) => {
      this.form.controls['recurso'].disable({ emitEvent: false });
      this.form.controls['segmento'].disable({ emitEvent: false });
      this.form.controls['inmueble'].disable({ emitEvent: false });

      if (this.form.get('rut')?.valid) {
        this.form.controls['recurso'].enable({ emitEvent: false });
      }
      if (this.form.get('recurso')?.valid && this.form.get('rut')?.valid) {
        this.form.controls['segmento'].enable({ emitEvent: false });
      }
      if (
        this.form.get('segmento')?.valid &&
        this.form.get('recurso')?.valid &&
        this.form.get('rut')?.valid
      ) {
        this.form.controls['inmueble'].enable({ emitEvent: false });
      }
      if (this.form.get('inmueble')?.valid) {
        this.form.controls['prospecto'].enable({ emitEvent: false });
      } else {
        this.form.controls['prospecto'].disable({ emitEvent: false });
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
          this.segmentos = this.segmentos.map((segmento) => {
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
          this.segmentos = this.segmentos.map((segmento) => {
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
  onFormRecursoChange() {
    this.form.get('recurso')?.valueChanges.subscribe((e) => {
      this.resetProspecto = false;
      setTimeout(() => {
        this.resetProspecto = true;
      }, 60);
    });
  }
}
