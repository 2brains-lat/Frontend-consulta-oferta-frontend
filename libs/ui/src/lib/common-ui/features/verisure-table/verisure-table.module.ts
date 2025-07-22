import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VerisureTableComponent } from './verisure-table.component';
import { PaginatorComponent } from './paginator/verisure-paginator.component';
import { InputComponent } from '../../components/input/input.component';

@NgModule({
  declarations: [VerisureTableComponent, PaginatorComponent],
  exports: [VerisureTableComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,

    InputComponent,
  ],
})
export class VerisureTableModule {}
