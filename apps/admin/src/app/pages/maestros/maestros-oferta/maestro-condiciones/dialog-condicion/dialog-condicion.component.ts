import {
  Component,
  Inject,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
} from '@angular/material/dialog';
import {
  customPercentageValidator,
  customMonthsValidator,
  customUniqueIdValidator,
} from '../../../customValidators/customFieldsValidator';
import { MaestrosOfertaService } from '../../maestros-oferta.service';

@Component({
  selector: 'verisure-dialog-condicion',
  templateUrl: './dialog-condicion.component.html',
  styleUrls: ['./dialog-condicion.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogCondicionComponent implements OnInit {
  formCondicion!: FormGroup;

  title!: string;
  mediosPagosOptions!: any[];
  hasCuponOptions!: any[];
  hasDescuentosOptions!: any[];
  myDataCondicion: any;

  mediosPagosSelected!: any[];
  hasCuponSelected!: { key: boolean; value: string };
  hasDescuentosSelected!: { key: boolean; value: string };

  idsMR!: any[];
  hasError = false;
  messageError!: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogCondicionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public maestrosOfertaService: MaestrosOfertaService
  ) {}

  ngOnInit(): void {
    this.title = this.data.title;
    this.mediosPagosOptions = this.data.mediosPagosOptions;
    this.hasCuponOptions = this.data.hasCuponOptions;
    this.hasDescuentosOptions = this.data.hasDescuentosOptions;

    this.formCondicion = this.fb.group({
      descripcion: [null, Validators.required],
      mediosDePago: [null, Validators.required],
      permiteCupon: [null, Validators.required],
      premiteDescuentoMonitoreo: [null, Validators.required],
      porcentajeDescuentoMonitoreo: [null, customPercentageValidator()],
      mesesDescuentoMonitoreo: [null, customMonthsValidator()],
      motorReglasId: [null, Validators.required],
      verisureId: [null, Validators.required],
    });

    /* ***** Verificación para habilitar/deshablitar campos de descuento ***** */
    this.formCondicion.controls[
      'premiteDescuentoMonitoreo'
    ].valueChanges.subscribe((hasDescuento) => {
      this.updateValidatorsFieldsDescuentos(hasDescuento);
    });

    /* ----------------------------------------------------------------------- */

    if (this.data.action === 'add') {
      this.formCondicion.setValue({
        descripción: '',
        mediosDePago: [],
        permiteCupon: '',
        premiteDescuentoMonitoreo: '',
        porcentajeDescuentoMonitoreo: '0.0',
        mesesDescuentoMonitoreo: 0,
        motorReglasId: '',
        verisureId: '',
      });
    } else {
      this.mediosPagosSelected = this.getMediosPagoSelected();
      this.hasCuponSelected = this.hasCuponOptions.find(
        (cat) => cat.value === this.data.formEdit.permiteCupon
      );
      this.hasDescuentosSelected = this.hasDescuentosOptions.find(
        (cuota) => cuota.value === this.data.formEdit.premiteDescuentoMonitoreo
      );

      this.formCondicion.setValue({
        descripcion:
          this.data.formEdit.descripcion === null
            ? 'Full'
            : this.data.formEdit.descripcion,
        mediosDePago: this.mediosPagosSelected,
        permiteCupon: this.data.formEdit.permiteCupon,
        premiteDescuentoMonitoreo: this.data.formEdit.premiteDescuentoMonitoreo,
        porcentajeDescuentoMonitoreo:
          this.data.formEdit.porcentajeDescuentoMonitoreo,
        mesesDescuentoMonitoreo: this.data.formEdit.mesesDescuentoMonitoreo,
        motorReglasId: this.data.formEdit.motorReglasId,
        verisureId: this.data.formEdit.verisureId,
      });

      // AGREGAR/QUITAR LAS VALIDACIONES DE REQUERIDO A LOS INPUTS DE DESCUENTOS...
      this.updateValidatorsFieldsDescuentos(
        this.data.formEdit.premiteDescuentoMonitoreo
      );
    }
  }

  updateValidatorsFieldsDescuentos(isRequired: boolean) {
    const nameFields = [
      'porcentajeDescuentoMonitoreo',
      'mesesDescuentoMonitoreo',
    ];

    nameFields.forEach((name) => {
      if (isRequired) {
        this.formCondicion.controls[name].addValidators(Validators.required);
        this.formCondicion.controls[name].updateValueAndValidity({
          onlySelf: true,
        });
      } else {
        this.formCondicion.controls[name].removeValidators(Validators.required);
        this.formCondicion.controls[name].updateValueAndValidity({
          onlySelf: true,
        });

        this.formCondicion.controls[name].setValue(
          name === 'porcentajeDescuentoMonitoreo' ? 0.0 : 0
        );
      }
    });
  }

  getMediosPagoSelected(): any[] {
    const auxMediosPagosOptions = [...this.mediosPagosOptions];
    const result: { key: string; value: string }[] = [];
    auxMediosPagosOptions.forEach((ele) => {
      if (this.data.formEdit.medioPagoI.includes(ele.value)) {
        result.push(ele.key);
      }
    });

    return result;
  }

  saveData() {
    const resultFormCondicion = {
      descripcion: this.formCondicion.controls['descripcion'].value,
      permiteCupon: this.formCondicion.controls['permiteCupon'].value,
      premiteDescuentoMonitoreo:
        this.formCondicion.controls['premiteDescuentoMonitoreo'].value,
      porcentajeDescuentoMonitoreo: parseFloat(
        parseFloat(
          this.formCondicion.controls['porcentajeDescuentoMonitoreo'].value
        ).toFixed(1)
      ),
      mesesDescuentoMonitoreo: parseInt(
        this.formCondicion.controls['mesesDescuentoMonitoreo'].value
      ),
      motorReglasId: this.formCondicion.controls['motorReglasId'].value,
      verisureId: this.formCondicion.controls['verisureId'].value,
      mediosDePago: this.mediosPagosOptions
        .filter((ele) =>
          this.formCondicion.controls['mediosDePago'].value.includes(ele.key)
        )
        .map((medioPago) => ({ id: medioPago.key, glosa: medioPago.value })),
    };

    if (this.data.action === 'add') {
      this.maestrosOfertaService
        .saveMaestrosOfferByCondicion(resultFormCondicion)
        .subscribe({
          next: (dataResult) => {
            this.formCondicion.reset();
            this.dialogRef.close({ edited: true, data: dataResult });
          },
          error: (err) => {
            const {
              error: { message },
              status,
            } = err;

            this.hasError = true;
            if (status === 400) {
              this.messageError = message;
            }
          },
        });
    } else {
      // const resultForm = {
      //   ...resultFormCondicion,
      //   condicionId: this.data.formEdit.condicionId,
      // };

      this.maestrosOfertaService
        .editMaestrosOfferByCondicion(
          resultFormCondicion,
          this.data.formEdit.condicionId
        )
        .subscribe({
          next: () => {
            this.formCondicion.reset();
            this.dialogRef.close({ edited: true });
          },
          error: (err) => {
            const {
              error: { message },
              status,
            } = err;

            this.hasError = true;
            if (status === 400) {
              this.messageError = message;
            }
          },
        });
    }
  }

  closeModal() {
    this.formCondicion.reset();
    this.dialogRef.close({ edited: false });
  }
}
