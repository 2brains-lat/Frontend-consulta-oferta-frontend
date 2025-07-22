/* eslint-disable @angular-eslint/no-output-on-prefix */
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  ErrorStateMatcher,
  MatNativeDateModule,
  MatOption,
} from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Subject } from 'rxjs';
import { inputTypeT, SizeUnitT } from '../utils';
import { enterStateAnimation } from '../../animations/enterState';
import { HighlightDirective } from '../../directives/highlight.directive';
import { FilterPipe } from '../../pipe/filter.pipe';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'verisure-input',
  standalone: true,
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],

  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    HighlightDirective, // -> added directive
    FilterPipe,
    FormsModule,
    MatIconModule,
    ReactiveFormsModule,
    MatNativeDateModule,
  ],
  providers: [MatDatepickerModule],
})
export class InputComponent implements AfterViewInit {
  state = '';
  stateMultiselect = [];
  stateChanges = new Subject<void>();

  @ViewChild('matInput', { static: false }) matInput!: ElementRef;
  //INPUTS
  suggestionSelectionLabel = '';
  @Input()
  suggestionSelectionValue = '';
  @Output() currentSearch = new EventEmitter();
  @Input()
  set width(value: SizeUnitT) {
    this._width = value;
    this.stateChanges.next();
  }
  get width() {
    return this._width;
  }
  private _width: SizeUnitT = '100%';
  @Input()
  set type(value: inputTypeT) {
    this._type = value;
    this.stateChanges.next();
  }
  get type() {
    return this._type;
  }
  private _type: inputTypeT = 'text';
  @Input()
  set label(value: string) {
    this._label = value;
    this.stateChanges.next();
  }
  get label() {
    return this._label;
  }
  private _label = 'input';

  @Input()
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  get placeholder() {
    return this._placeholder;
  }
  private _placeholder = '';

  @ContentChildren(MatOption)
  get queryOptions() {
    return this._queryOptions;
  }
  set queryOptions(value: QueryList<MatOption>) {
    this.options = value.map((x) => {
      return { value: x.value, label: x.viewValue };
    });
    this._queryOptions = value;
  }
  _queryOptions!: QueryList<MatOption>;
  @Input()
  options!: { value: string; label: string }[];
  yet!: boolean;

  // form js
  matcher = new MyErrorStateMatcher();
  @Input() set control(value: FormControl) {
    if (this.formControl !== value) {
      this.formControl = value;
    }
  }

  formControl: FormControl = new FormControl('');

  //on change
  @Output() onChange = new EventEmitter();

  @Input()
  set disabled(value: boolean) {
    this._disabled = value;
    if (value) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }
  get disabled() {
    return this._disabled;
  }
  private _disabled = false;
  canIgnoreOnClick = false;

  onInput(value: any) {
    if (typeof value === 'string') {
      this.state = value;
    } else {
      this.stateMultiselect = value;
    }
    this.onChange.emit(value);
    this.formControl.disable();
  }

  onChangeEvent(target: unknown) {
    if (this.suggestionSelectionLabel.length > 0) {
      this.resetSuggestionSelection();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.yet = true;
    });
  }
  suggestionSelected(value: string, label: string) {
    this.canIgnoreOnClick = true;
    this.suggestionSelectionValue = value;
    this.suggestionSelectionLabel = label;
    this.currentSearch.emit(value);
    this.formControl.setValue(label);
  }
  resetSuggestionSelection() {
    this.suggestionSelectionLabel = '';
    this.suggestionSelectionValue = '';
    this.currentSearch.emit('');
  }
  /* nueva logica para enviar una busqueda */
  sendSearch() {
    if (this.type === 'search-select') return;
    this.currentSearch.emit(this.formControl.value);
  }
}
