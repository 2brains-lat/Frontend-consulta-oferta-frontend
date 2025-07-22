import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { customPrecioValidator } from '../../../customValidators/customFieldsValidator';
import { MaestrosOfertaService } from '../../maestros-oferta.service';

@Component({
  selector: 'verisure-dialog-precio',
  templateUrl: './dialog-precio.component.html',
  styleUrls: ['./dialog-precio.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogPrecioComponent implements OnInit {
  formPrecio!: FormGroup;

  title!: string;
  productosOptions!: any[];
  categoriasOptions!: any[];
  tipoCuotasOptions!: any[];
  tipoMonedasOptions!: any[];
  myDataPrecio: any;

  productoSelected!: { key: string; value: string };
  categoriaSelected!: { key: string; value: string };
  tipoCuotaSelected!: { key: string; value: string };
  tipoMonedaISelected!: { key: string; value: string };
  tipoMonedaMSelected!: { key: string; value: string };

  hasError = false;
  messageError!: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogPrecioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private maestrosOfertaService: MaestrosOfertaService
  ) {}

  ngOnInit(): void {
    this.formPrecio = this.fb.group({
      productoId: [null, Validators.required],
      categoriaId: [null, Validators.required],
      verisureIdBase: [null, Validators.required],
      precioI: [0, [Validators.required, customPrecioValidator('instalación')]],
      tipoMonedaI: [null, Validators.required],
      precioM: [0, [Validators.required, customPrecioValidator('monitoreo')]],
      tipoMonedaM: [null, Validators.required],
      tipoCuota: [null, Validators.required],
      motorReglasId: [null, Validators.required],
      verisureIdI: [null, Validators.required],
      verisureIdM: [null, Validators.required],
    });

    this.title = this.data.title;
    this.productosOptions = this.data.productosOptions;
    this.categoriasOptions = this.data.categoriasOptions;
    this.tipoCuotasOptions = this.data.tipoCuotasOptions;
    this.tipoMonedasOptions = this.data.tipoMonedasOptions;

    if (this.data.action === 'add') {
      this.formPrecio.setValue({
        productoId: '',
        categoriaId: '',
        verisureIdBase: '',
        precioI: 0,
        tipoMonedaI: '',
        precioM: 0,
        tipoMonedaM: '',
        tipoCuota: '',
        motorReglasId: '',
        verisureIdI: '',
        verisureIdM: '',
      });
    } else {
      this.productoSelected = this.productosOptions.find(
        (prod) => prod.key === this.data.formEdit.productoId
      );
      this.categoriaSelected = this.categoriasOptions.find(
        (cat) => cat.key === this.data.formEdit.categoriaId
      );
      this.tipoCuotaSelected = this.tipoCuotasOptions.find(
        (cuota) => cuota.value === this.data.formEdit.tipoCuota
      );
      this.tipoMonedaISelected = this.tipoMonedasOptions.find(
        (monedaI) => monedaI.value === this.data.formEdit.tipoMonedaI
      );
      this.tipoMonedaMSelected = this.tipoMonedasOptions.find(
        (monedaM) => monedaM.value === this.data.formEdit.tipoMonedaM
      );

      this.formPrecio.setValue({
        productoId: this.productoSelected.key,
        categoriaId: this.categoriaSelected.key,
        verisureIdBase: this.data.formEdit.verisureIdBase,
        precioI: this.data.formEdit.precioInstalacion.precio,
        tipoMonedaI: this.tipoMonedaISelected.key,
        precioM: this.data.formEdit.precioMonitoreo.precio,
        tipoMonedaM: this.tipoMonedaMSelected.key,
        tipoCuota: this.tipoCuotaSelected.key,
        motorReglasId: this.data.formEdit.motorReglasId,
        verisureIdI: this.data.formEdit.verisureIdI,
        verisureIdM: this.data.formEdit.verisureIdM,
      });
    }
  }

  saveData() {
    const resultFormPrecio = {
      productoId: this.formPrecio.controls['productoId'].value,
      verisureId: this.formPrecio.controls['verisureIdBase'].value,
      motorReglasId: this.formPrecio.controls['motorReglasId'].value,
      precioInstalacion: {
        precioInstalacionCategoria:
          this.formPrecio.controls['categoriaId'].value,
        precioInstalacion: parseInt(this.formPrecio.controls['precioI'].value),
        precioInstalacionMoneda: this.formPrecio.controls['tipoMonedaI'].value,
        precioInstalacionVerisureId:
          this.formPrecio.controls['verisureIdI'].value,
      },
      precioMonitoreo: {
        precioMonitoreoTipoCuota: this.formPrecio.controls['tipoCuota'].value,
        precioMonitoreo: parseFloat(this.formPrecio.controls['precioM'].value),
        precioMonitoreoMoneda: this.formPrecio.controls['tipoMonedaM'].value,
        precioMonitoreoVerisureId:
          this.formPrecio.controls['verisureIdM'].value,
      },
    };

    if (this.data.action === 'add') {
      this.maestrosOfertaService
        .saveMaestrosOfferByPrecio(resultFormPrecio)
        .subscribe({
          next: (dataResult) => {
            this.formPrecio.reset();
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
      this.maestrosOfertaService
        .editMaestrosOfferByPrecio(
          resultFormPrecio,
          this.data.formEdit.precioId
        )
        .subscribe({
          next: () => {
            this.formPrecio.reset();
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
    this.formPrecio.reset();
    this.dialogRef.close({ edited: false });
  }
}
