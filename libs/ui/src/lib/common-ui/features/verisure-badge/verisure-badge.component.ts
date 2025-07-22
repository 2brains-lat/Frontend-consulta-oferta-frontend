import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'verisure-badge',
  templateUrl: './verisure-badge.component.html',
  styleUrls: ['./verisure-badge.component.scss'],
})
export class VerisureBadgeComponent implements OnChanges {
  @Input() form?: FormGroup;
  @Input() catalogs: any;
  @Input() labels: any;
  @Output() clickItem = new EventEmitter<any>();

  @Input() keyOption = 'value';
  @Input() labelOption = 'label';
  catalogObject: any = {};

  // keys: Array<string> = [];
  flatData: Array<any> = [];
  _models: any = {};
  sw = true;
  @Input() get models() {
    return this._models;
  }
  public set models(data: any) {
    const keys = Object.keys(data);
    const flatData: any = [];
    keys.forEach((key) => {
      if (data[key].length > 0) {
        data[key].forEach((item: any) => {
          flatData.push({
            field: key,
            value: item,
          });
        });
      }
    });

    this.flatData = [...flatData];
    this._models = data;
  }

  // ngOnInit() {
  //   const keys = Object.keys(this.catalogs);
  //   keys.forEach((item) =>{
  //     this.catalogObject[item] = this.catalogs[item].reduce((result:any, obj:any)=>{
  //       result[obj[this.keyOption]] = obj[this.labelOption];
  //       return result;
  //     },{});
  //   });
  // }

  ngOnChanges(): void {
    const keys = Object.keys(this.catalogs);
    keys.forEach((item) => {
      this.catalogObject[item] = this.catalogs[item].reduce(
        (result: any, obj: any) => {
          result[obj[this.keyOption]] = obj[this.labelOption];
          return result;
        },
        {}
      );
    });
  }

  clickData(item: any) {
    this.clickItem.emit(item);
  }
}
