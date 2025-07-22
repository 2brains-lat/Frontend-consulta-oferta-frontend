/* eslint-disable @angular-eslint/no-output-on-prefix */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'verisure-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatButtonToggleModule],
})
export class TabComponent {
  // @Input() onChange: any = '';
  @Input() items: { value: string; label: string; disabled?: boolean }[] = [
    { value: 'test', label: 'Test' },
  ];
  @Input() selectedItemName = '';
  @Input() class: 'tab' | 'subtab' = 'tab';
  @Output() onChange = new EventEmitter<string>();
  onValChange(value: string) {
    console.log(value);
    this.onChange.emit(value);
  }
}
