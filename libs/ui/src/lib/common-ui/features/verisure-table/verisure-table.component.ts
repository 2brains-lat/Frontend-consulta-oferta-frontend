import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { OptionColumn } from './types';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'verisure-table',
  templateUrl: './verisure-table.component.html',
  styleUrls: ['./verisure-table.component.scss'],
})
export class VerisureTableComponent implements OnInit, OnChanges {
  @Input() displayedColumns: OptionColumn[] = [];
  // @Input() dataSource: any[] = [];
  @Input() dataSource: MatTableDataSource<any>[] = [];
  @Input() page!: number;
  @Input() limit!: number;
  @Input() totalItems!: number;
  @Input() textResults = 'Resultados';

  @Output() nextPage = new EventEmitter();
  @Output() prevPage = new EventEmitter();
  @Output() changeLimitPage = new EventEmitter();

  columns: string[] = [];
  view = true;
  columnsObject: any = {};
  rangePage: number[] = [10, 20, 30];
  constructor() {}

  ngOnInit() {
    this.columns = this.displayedColumns.map((e) => e.value);
    this.displayedColumns.forEach((data) => {
      this.columnsObject[data.value] = data;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {}

  nextPagePaginator() {
    this.nextPage.emit();
  }

  prevPagePaginator() {
    this.prevPage.emit();
  }
  changeLimit(data: any) {
    this.changeLimitPage.emit(data);
  }
}
