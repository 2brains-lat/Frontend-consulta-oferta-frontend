import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerisureBadgeComponent } from './verisure-badge.component';



@NgModule({
  exports: [VerisureBadgeComponent],
  declarations: [VerisureBadgeComponent],
  imports: [
    CommonModule
  ]
})
export class VerisureBadgeModule { }
