import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerisureMulticheckboxComponent } from './verisure-multicheckbox.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';



@NgModule({
  exports:[VerisureMulticheckboxComponent],
  declarations: [VerisureMulticheckboxComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
  ]
})
export class VerisureMultipleCheckboxModule { }
