import {
  Component,
  Input,
  OnInit,
  forwardRef,
  ViewEncapsulation,
  OnChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'verisure-multicheckbox',
  templateUrl: './verisure-multicheckbox.component.html',
  styleUrls: ['./verisure-multicheckbox.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VerisureMulticheckboxComponent implements OnChanges, OnInit {
  @Input() catalog: any[] = [];
  @Input() label = '';
  @Input() control!: FormControl;

  @Input() keyOption = 'value';
  @Input() labelOption = 'label';

  _catalog: any[] = [];

  ngOnInit(): void {
    this.control.valueChanges.subscribe((response) => {
      this._catalog = this._catalog.map((data: any) => {
        if (response.indexOf(data[this.keyOption]) > -1) {
          if (!data.active) {
            data.active = true;
          }
        } else {
          data.active = false;
        }
        return data;
      });
    });
  }

  ngOnChanges(): void {
    const values = this.control.getRawValue() || [];
    this._catalog = this.catalog.map((data: any) => {
      return {
        ...data,
        active: values.indexOf(data[this.keyOption]) > -1,
      };
    });

    // this.control.valueChanges.subscribe((response) => {
    //   this._catalog = this._catalog.map((data: any) => {
    //     if (response.indexOf(data[this.keyOption]) > -1) {
    //       if (!data.active) {
    //         data.active = true;
    //       }
    //     } else {
    //       data.active = false;
    //     }
    //     return data;
    //   });
    // });
  }
  changeData() {
    const values = this._catalog
      .filter((item: any) => {
        return item.active;
      })
      .map((item: any) => {
        return item[this.keyOption];
      });
    this.control.setValue(values);
  }
}
