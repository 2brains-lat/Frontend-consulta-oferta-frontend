import {
  Component,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@verisure/ui';
import { InputComponent } from '@verisure/ui';
import { MatSelectModule } from '@angular/material/select';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RadioButtonComponent } from '../../common-ui/components/radio-button/radio-button.component';

@Component({
  selector: 'verisure-kitui-lab',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    RadioButtonComponent,
    InputComponent,
    ReactiveFormsModule,
    MatSelectModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,

    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './kitui-lab.component.html',
  styleUrls: ['./kitui-lab.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class KituiLabComponent {
  @ViewChild('input1', { read: InputComponent })
  input: QueryList<InputComponent> | undefined;
  form: FormGroup;
  states: string[] = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Carolina',
    'North Dakota',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming',
  ];
  constructor(fb: FormBuilder) {
    this.form = fb.group({
      // field1: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      select: [null, [Validators.required]],
      radio: ['', [Validators.required]],
    });
  }


  //test buttons
  Submit = () => {
    console.log('hola desde home');
    // console.log(this.form.get('email')?.valid); valid if 1 control is true
  };
}
