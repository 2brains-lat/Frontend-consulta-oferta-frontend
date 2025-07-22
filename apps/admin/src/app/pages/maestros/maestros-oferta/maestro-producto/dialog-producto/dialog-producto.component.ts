import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { customUniqueIdFieldValidator } from '../../../customValidators/customFieldsValidator';
import { MaestrosOfertaService } from '../../maestros-oferta.service';

@Component({
  selector: 'verisure-dialog-producto',
  templateUrl: './dialog-producto.component.html',
  styleUrls: ['./dialog-producto.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogProductoComponent implements OnInit {
  formProduct!: FormGroup;

  title!: string;
  tipoItemOptions!: any[];
  subtiposOptions!: any[];
  myDataProduct: any;

  messageError!: string;
  hasError = false;
  changedSubtipo = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private maestrosOfertaService: MaestrosOfertaService
  ) {}

  ngOnInit(): void {
    this.title = this.data.title;
    this.tipoItemOptions = this.data.tipoItemsOptions;
    this.subtiposOptions = this.data.subtypeOptions;
    this.changedSubtipo = true;

    this.formProduct = this.fb.group({
      descripcion: [null, Validators.required],
      tipoItem: [null, Validators.required],
      subtipo: [null, Validators.required],
      idVerisure: [null, Validators.required],
      idVerisureSuperCuota: [null],
    });

    if (this.data.action === 'add') {
      this.formProduct.setValue({
        descripcion: '',
        tipoItem: '',
        subtipo: '',
        idVerisure: '',
        idVerisureSuperCuota: '',
      });
    } else {
      this.formProduct.setValue({
        descripcion: this.data.formEdit.descripcion,
        tipoItem: this.data.formEdit.tipoItem.tipoItemId,
        subtipo: this.data.formEdit.subtipo.subtipoItemId,
        idVerisure: this.data.formEdit.idVerisure,
        idVerisureSuperCuota: this.data.formEdit.idVerisureSuperCuota,
      });
    }

    this.formProduct.controls['tipoItem'].valueChanges.subscribe(
      (valueIdtipoItem) => {
        this.getSubtipoByType(valueIdtipoItem);
      }
    );

    this.formProduct.controls['idVerisure'].valueChanges.subscribe(() => {
      this.updateValidatorsFieldSuperID();
    });

    this.formProduct.controls['idVerisureSuperCuota'].valueChanges.subscribe(
      () => {
        this.updateValidatorsFieldSuperID();
      }
    );
  }

  getSubtipoByType(idTipoItem: any) {
    this.formProduct.controls['subtipo'].patchValue('');
    this.changedSubtipo = false;

    this.maestrosOfertaService
      .getSubtipos(idTipoItem)
      .subscribe((resSubtipos) => {
        this.subtiposOptions = [];

        const currentSubtipos = [...resSubtipos].map((sub: any) => ({
          key: sub.subtipoProductoId,
          value: sub.descripcion,
        }));

        this.subtiposOptions = currentSubtipos;
        this.changedSubtipo = true;
      });
  }

  updateValidatorsFieldSuperID() {
    const idVerisureValue = this.formProduct.controls['idVerisure'].value;
    const idVerisureSupercuotaValue =
      this.formProduct.controls['idVerisureSuperCuota'].value;

    if (idVerisureValue === idVerisureSupercuotaValue) {
      this.formProduct.controls['idVerisure'].addValidators(
        customUniqueIdFieldValidator(idVerisureSupercuotaValue)
      );
      this.formProduct.controls['idVerisureSuperCuota'].addValidators(
        customUniqueIdFieldValidator(idVerisureValue)
      );

      this.formProduct.controls['idVerisure'].updateValueAndValidity({
        emitEvent: false,
      });
      this.formProduct.controls['idVerisureSuperCuota'].updateValueAndValidity({
        emitEvent: false,
      });
    } else {
      this.formProduct.controls['idVerisure'].setValidators([
        Validators.required,
      ]);
      this.formProduct.controls['idVerisureSuperCuota'].setValidators(null);

      this.formProduct.controls['idVerisure'].updateValueAndValidity({
        emitEvent: false,
      });
      this.formProduct.controls['idVerisureSuperCuota'].updateValueAndValidity({
        emitEvent: false,
      });
    }
  }

  saveData() {
    const resultFormProducto = {
      descripcion: this.formProduct.controls['descripcion'].value,
      tipoItem: this.tipoItemOptions.find(
        (t) => t.key === this.formProduct.controls['tipoItem'].value
      )?.key,
      subtipo: this.subtiposOptions.find(
        (s) => s.key === this.formProduct.controls['subtipo'].value
      )?.key,
      idVerisureSuperCuota:
        this.formProduct.controls['idVerisureSuperCuota'].value,
      idVerisure: this.formProduct.controls['idVerisure'].value,
    };

    if (this.data.action === 'add') {
      this.maestrosOfertaService
        .saveMaestrosOfferByProducto(resultFormProducto)
        .subscribe({
          next: (dataResult) => {
            this.formProduct.reset();
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
        .editMaestrosOfferByProducto(
          resultFormProducto,
          this.data.formEdit.productoId
        )
        .subscribe({
          next: () => {
            this.formProduct.reset();
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
    this.formProduct.reset();
    this.dialogRef.close({ edited: false });
  }
}
