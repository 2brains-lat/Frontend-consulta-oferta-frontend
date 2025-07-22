import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'verisure-paginator',
  templateUrl: './verisure-paginator.component.html',
  styleUrls: ['./verisure-paginator.component.scss'],
})
export class PaginatorComponent implements OnInit {
  formPaginator!: FormGroup;

  @Input() labelLeft!: string;
  @Input() labelRight!: string;
  @Input() currentPage!: number;
  @Input() delimiter = 'de';
  @Input() limitPage!: number;

  @Input() rangePage: number[] = [10, 20, 30];

  @Output() nextPage = new EventEmitter();
  @Output() prevPage = new EventEmitter();
  @Output() changeLimitPage = new EventEmitter();
  selected!: number;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.selected = this.rangePage[0];

    this.formPaginator = this.fb.group({
      sizeList: [this.selected],
    });

    this.formPaginator.controls['sizeList'].valueChanges.subscribe(
      (newSize) => {
        this.changeLimitPage.emit(newSize);
      }
    );
  }
  clickNext() {
    this.nextPage.emit('dasds');
  }

  clickPrev() {
    this.prevPage.emit();
  }

  changeLimit() {
    this.changeLimitPage.emit(this.selected);
  }
}
