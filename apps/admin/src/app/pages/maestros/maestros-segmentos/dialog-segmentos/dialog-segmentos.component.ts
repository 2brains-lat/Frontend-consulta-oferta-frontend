import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaestrosSegmentoService } from '../maestros-segmentos.service';

@Component({
  selector: 'verisure-segmentos-condicion',
  templateUrl: './dialog-segmentos.component.html',
  styleUrls: ['./dialog-segmentos.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogSegmentsComponent implements OnInit {
  form!: FormGroup;

  title!: string;
  action = '';
  module = '';

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
    private dialogRef: MatDialogRef<DialogSegmentsComponent>,
    private maestrosSegmentosService: MaestrosSegmentoService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      motorReglasId: new FormControl(null, Validators.required),
      verisureId: new FormControl(null, Validators.required),
      glosa: new FormControl(null, Validators.required),
      agrupacionId: new FormControl(),
      agrupacion: new FormControl(),
      descripcion: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.title = this.data.config.title;
    this.action = this.data.config.action;
    this.module = this.data.config.tabSelect.label;

    if (this.data.config.action === 'add') {
      this.form.setValue({
        motorReglasId: null,
        verisureId: null,
        glosa: null,
        agrupacionId: this.data.seed.agrupacionId,
        agrupacion: this.data.config.tabSelect.agrupacion,
        descripcion: null,
      });
    } else {
      this.form.setValue({
        motorReglasId: this.data.seed.motorReglasId,
        verisureId: this.data.seed.verisureId,
        glosa: this.data.seed.glosa,
        agrupacionId: this.data.seed.agrupacionId,
        agrupacion: this.data.config.tabSelect.agrupacion,
        descripcion: this.data.seed.descripcion,
      });
    }
  }

  saveData() {
    const data = this.form.getRawValue();
    delete data.agrupacion;
    if (this.data.config.action === 'add') {
      this.maestrosSegmentosService
        .saveMaestrosBySegmento(this.data.config.tabSelect, data)
        .subscribe({
          next: (resp) => {
            this.dialogRef.close({ edited: true, data: resp });
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
      data.segmentoId = this.data.seed.segmentoId;
      this.editData({ edited: true, data: data });
    }
  }

  editData(data: any) {
    this.maestrosSegmentosService
      .editMaestrosBySegmento(this.data.config.tabSelect, data)
      .subscribe({
        next: (resp) => {
          this.dialogRef.close({ edited: true, data: resp });
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

  closeModal() {
    this.dialogRef.close({ edited: false });
  }
}
