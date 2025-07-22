import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'verisure-breadcrumb',
  imports: [CommonModule, MatTabsModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  standalone: true,
})
export class BreadcrumbComponent {
  @Input() items: { id: string; label: string; disabled?: boolean }[] = [
    { id: '', label: '', disabled: false },
  ];
  @Input() initTab = '1';
  @Output() tabChange = new EventEmitter<string>();

  urlArrowIcon = 'assets/icons/icon-arrow-breadcrumb.svg';
  urlArrowIconActive = 'assets/icons/icon-arrow-breadcrumb-active.svg';

  tabSelected(event: MatTabChangeEvent) {
    const tabSelected = event.index.toString();

    window?.document
      ?.querySelector(
        'body > verisure-root > verisure-app-layout > mat-sidenav-container > mat-sidenav-content'
      )
      ?.scroll({
        top: 0,
        left: 0,
        behavior: 'auto',
      });
    this.tabChange.emit(tabSelected);
  }
}
