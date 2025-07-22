/* eslint-disable no-prototype-builtins */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AlertComponent,
  TinyCardComponent,
  TabComponent,
  CardProductComponent,
  enterLeaveAlertAnimation,
} from '@verisure/ui';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {
  BusinessRuleT,
  iconDict,
  LoaderService,
  ReglasService,
  RequestStatusAlertService,
  tipoReglas,
} from '@verisure/services';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'verisure-reglas-de-negocio',
  imports: [
    CommonModule,
    TinyCardComponent,
    CardProductComponent,
    AlertComponent,
    TabComponent,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  standalone: true,
  animations: [enterLeaveAlertAnimation],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './reglas-de-negocio.component.html',
  styleUrls: ['./reglas-de-negocio.component.scss'],
})
export class ReglasDeNegocioComponent implements OnInit {
  activeHover: string | null = null;
  reset = true;
  tabSelectors = [
    {
      value: tipoReglas.VENTAS,
      label: 'Ventas',
    },
    {
      value: tipoReglas.FINANZAS,
      label: 'Finanzas',
    },
    {
      value: tipoReglas.MARKETING,
      label: 'Marketing',
    },
  ];
  set allRules(newValue: BusinessRuleT[]) {
    this.reglas = newValue.filter((rule) => rule.tipo === this.currentTab);
    this._allRules = newValue;
  }
  get allRules() {
    return this._allRules;
  }
  _allRules!: BusinessRuleT[];

  set currentTab(value: string) {
    this.reglas = this.allRules.filter((regla) => regla.tipo === value);
    this._currentTab = value;
  }
  get currentTab() {
    return this._currentTab;
  }
  private _currentTab = tipoReglas.VENTAS;
  reglas!: BusinessRuleT[];
  alertStatus: { status: number; message: string } | null = null;
  constructor(
    private alertService: RequestStatusAlertService,
    private reglasService: ReglasService,
    private loaderService: LoaderService,
    private title: Title
  ) {
    this.title.setTitle('Reglas de Negocio | Admin | Consulta oferta Verisure');
  }
  ngOnInit() {
    this.loaderService.show('Cargando Reglas de Negocio...');
    this.reglasService
      .getAllBusinessRules()
      .then((rules) => (this.allRules = rules))
      .then(() => this.loaderService.hide())
      .catch(() => this.loaderService.hide());
    this.alertService.requestStatus.subscribe((e) => {
      this.loaderService.hide();
      this.reset = true;
      this.alertStatus = e;
    });
  }

  svgIcon(id: unknown) {
    if (iconDict.hasOwnProperty(id as string)) {
      const idTyped = id as keyof unknown;
      return 'assets/icons/' + iconDict[idTyped] + '.svg';
    }
    return;
  }
  formatDate(isoDate: string) {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().substr(-2);
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate; // Output: 31-03-23
  }
  setActiveHover(newValue: string | null) {
    this.activeHover = newValue;
  }
  downloadAction(id: string, fileName: string) {
    this.reglasService.downloadRules({ id }).then((blobPromise) => {
      console.log(blobPromise);
      const newBlob = new Blob([blobPromise.body as Blob], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const aElement = document.createElement('a');
      const objUrl = URL.createObjectURL(newBlob);
      aElement.href = objUrl;
      aElement.download = fileName;
      aElement.click();
      URL.revokeObjectURL(objUrl);
    });
  }
  uploaddAction(event: Event, id: string) {
    this.reset = false;
    if (event == undefined) throw new Error('ERROR ON TARGET FILE');
    const files: FileList | null = (event.target as unknown as HTMLInputElement)
      .files;
    if (files == null) throw new Error('ERROR ON UPLOAD FILES');
    const formData: FormData = new FormData();
    formData.append('file', files[0], files[0].name);
    console.log('formData :', formData);
    this.loaderService.show('Cargando Reglas de Negocio...');
    this.reglasService
      .updateBusinessRules({ id, formData })
      .then((e) => {
        this.reset = true;
        this.reglasService
          .getAllBusinessRules()
          .then((rules) => (this.allRules = rules))
          .then(() => {
            this.alertStatus = {
              status: 200,
              message: 'Nuevas reglas cargadas de forma exitosa!',
            };
          })
          .then(() => this.loaderService.hide())
          .catch(() => this.loaderService.hide());
        setTimeout(() => {
          this.alertStatus = null;
        }, 3900);
      })
      .catch((e) => {
        console.log(e, ' error upload file');
        this.loaderService.hide();
      });
  }
}
