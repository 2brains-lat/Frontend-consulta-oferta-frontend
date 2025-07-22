import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { OptionColumn, typeColumn } from '../../types';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MaestrosOfertaService } from '../maestros-oferta.service';
import { LoaderService } from '@verisure/services';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogCondicionComponent } from './dialog-condicion/dialog-condicion.component';
import { enterLeaveAlertAnimation, enterStateAnimation } from '@verisure/ui';
import { SearchbarListAdminComponent } from '@verisure/ui';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'verisure-maestro-condiciones',
  templateUrl: './maestro-condiciones.component.html',
  styleUrls: ['./maestro-condiciones.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [enterLeaveAlertAnimation, enterStateAnimation],
})
export class MaestroCondicionesComponent implements OnInit {
  @Input() tabItem!: string;

  displayedColumns: OptionColumn[] = [
    {
      name: 'Descripción',
      type: typeColumn.TEXT,
      value: 'descripcion',
    },
    {
      name: 'Medio de pago instalación',
      type: typeColumn.TEXT,
      value: 'medioPagoI',
    },
    {
      name: 'Cupón',
      type: typeColumn.DYNAMIC,
      value: 'permiteCupon',
    },
    {
      name: 'Descuento Monitoreo',
      type: typeColumn.DYNAMIC,
      value: 'premiteDescuentoMonitoreo',
    },
    {
      name: 'Porcentaje Descuento Monitoreo',
      type: typeColumn.PERCENTAGE,
      value: 'porcentajeDescuentoMonitoreo',
    },
    {
      name: 'Meses Descuento Monitoreo',
      type: typeColumn.NUMBER,
      value: 'mesesDescuentoMonitoreo',
    },
    {
      name: 'ID MR',
      type: typeColumn.TEXT,
      value: 'motorReglasId',
    },
    {
      name: 'Estado',
      value: 'activo',
      type: typeColumn.DYNAMIC,
    },
    {
      name: 'Editar',
      value: 'editar',
      type: typeColumn.DYNAMIC,
    },
  ];

  elementData: any = [];
  // pagination
  currentPage = 1;
  totalItems = 0;
  totalPaginas = 0;
  itemPerPage = 10;
  sw = true;
  hasAdded = false;
  messageAlertList = '';

  @ViewChild('toggle', { static: true }) toggle: any = MatSlideToggle;
  @ViewChild('btn', { static: true }) editBtn: any;
  @ViewChild('cupon', { static: true }) cupon: any;
  @ViewChild('descuento', { static: true }) descuento: any;
  @ViewChild('searchbar') sidevarFilter!: SearchbarListAdminComponent;
  action = 'add';

  catalogs: any = {
    hasCuponOptions: [],
    hasDescuentosOptions: [],
    state: [],
  };

  query: any = {
    hasCuponOptions: [],
    hasDescuentosOptions: [],
    state: [],
  };

  labelsCatalog: any = {
    hasCuponOptions: '¿Permite cupón?',
    hasDescuentosOptions: '¿Permite descuento monitoreo?',
    state: 'Estado',
  };

  form: FormGroup;
  formSearch!: FormGroup;
  mediosPagosOptions!: { key: string; value: string }[];
  hasCuponOptions!: { key: boolean; value: string }[];
  hasDescuentosOptions!: { key: boolean; value: string }[];
  estadoCatalogos!: { key: number; value: string }[];

  finalFiltersQueries = '';

  constructor(
    public fb: FormBuilder,
    public maestrosOfertaService: MaestrosOfertaService,
    private loaderService: LoaderService,
    private dialog: MatDialog
  ) {
    this.formSearch = this.fb.group({
      results: [[]],
    });

    this.form = this.fb.group({
      hasCuponOptions: new FormControl(),
      hasDescuentosOptions: new FormControl(),
      state: new FormControl(),
    });
    this.loaderService.show('Cargando Condiciones...');
    setTimeout(async () => {
      await this.fillDataTable();
      this.loaderService.hide();
    }, 1000);
  }

  ngOnInit(): void {
    this.hasCuponOptions = [
      {
        key: true,
        value: 'Si',
      },
      {
        key: false,
        value: 'No',
      },
    ];
    this.hasDescuentosOptions = [
      {
        key: true,
        value: 'Si',
      },
      {
        key: false,
        value: 'No',
      },
    ];

    this.estadoCatalogos = [
      {
        key: 1,
        value: 'Activo',
      },
      {
        key: 0,
        value: 'Inactivo',
      },
    ];

    forkJoin([this.maestrosOfertaService.getMetodosPagos()])
      .pipe()
      .subscribe(([metodosPagos]) => {
        this.mediosPagosOptions = metodosPagos.map((ele: any) => ({
          key: ele.medioPagoId,
          value: ele.glosa,
        }));
      });

    this.displayedColumns = this.displayedColumns.map((e) => {
      if (e.value == 'activo') {
        e.template = this.toggle;
      }
      if (e.value == 'editar') {
        e.template = this.editBtn;
      }
      if (e.value == 'permiteCupon') {
        e.template = this.cupon;
      }
      if (e.value == 'premiteDescuentoMonitoreo') {
        e.template = this.descuento;
      }
      return e;
    });

    this.catalogs = {
      hasCuponOptions: [
        {
          value: 1,
          label: 'Si',
        },
        {
          value: 0,
          label: 'No',
        },
      ],

      hasDescuentosOptions: [
        {
          value: 1,
          label: 'Si',
        },
        {
          value: 0,
          label: 'No',
        },
      ],
      state: [
        {
          value: 1,
          label: 'Activo',
        },
        {
          value: 0,
          label: 'Inactivo',
        },
      ],
    };

    this.formSearch.controls['results'].valueChanges.subscribe(
      (searchEvent) => {
        if (searchEvent === '') {
          this.fillDataTable();
        }
      }
    );
  }

  nextPage() {
    this.currentPage++;
    this.fillDataTable();
  }

  prevPage() {
    this.currentPage--;
    this.fillDataTable();
  }

  changeLimit(data: any) {
    this.itemPerPage = data;
    this.fillDataTable();
  }

  changeToggle(item: any) {
    const resultFormCondicion = {
      descripcion: item.descripcion,
      permiteCupon: item.permiteCupon,
      premiteDescuentoMonitoreo: item.premiteDescuentoMonitoreo,
      porcentajeDescuentoMonitoreo: item.porcentajeDescuentoMonitoreo,
      mesesDescuentoMonitoreo: item.mesesDescuentoMonitoreo,
      motorReglasId: item.motorReglasId,
      verisureId: item.verisureId,
      mediosDePago: item.mediosDePago,
      activo: !item.activo,
    };

    this.maestrosOfertaService
      .editMaestrosOfferByCondicion(resultFormCondicion, item.condicionId)
      .subscribe({
        next: (dataResult) => {
          this.fillDataTable();
          this.hasAdded = true;
          this.messageAlertList = 'La condición se ha modificado con éxito';
          setTimeout(() => {
            this.hasAdded = false;
            this.messageAlertList = '';
          }, 2000);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  async fillDataTable(searchQuery?: any) {
    let query =
      this.finalFiltersQueries !== ''
        ? `page=${this.currentPage}&size=${this.itemPerPage}&${this.finalFiltersQueries}`
        : `page=${this.currentPage}&size=${this.itemPerPage}`;

    if (searchQuery && searchQuery !== '') {
      query += `&motorReglasId=${searchQuery}`;
    }

    this.sw = false;

    this.maestrosOfertaService
      .getListCondiciones(query)
      .subscribe((respCondiciones) => {
        const result = respCondiciones.data.map((ele: any) => ({
          ...ele,
          medioPagoI: this.formatMediosPagoNames([...ele.mediosDePago]),
        }));
        this.elementData = result;

        this.totalPaginas = respCondiciones.totalPaginas;
        this.totalItems = respCondiciones.totalItems;

        if (this.loaderService.isLoading) {
          this.loaderService.hide();
        }
      });
  }

  formatMediosPagoNames(mediosP: any[]): string[] {
    return mediosP.map((m) => m.glosa);
  }

  getNewSearch(dataSearch: any) {
    this.currentPage = 1;
    this.fillDataTable(dataSearch);
  }

  clickAddItem(data: any) {
    this.action = 'add';
    const dialogConfig = new MatDialogConfig();

    dialogConfig.hasBackdrop = true;
    dialogConfig.closeOnNavigation = true;

    dialogConfig.data = {
      title: 'Maestro Oferta: Creación de condición',
      mediosPagosOptions: this.mediosPagosOptions,
      hasCuponOptions: this.hasCuponOptions,
      hasDescuentosOptions: this.hasDescuentosOptions,
      action: this.action,
    };

    const dialogRef = this.dialog.open(DialogCondicionComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (!result) {
        return;
      }

      if (result.edited) {
        this.loaderService.show('Cargando Condiciones...');
        await this.fillDataTable();

        this.hasAdded = true;
        this.messageAlertList = 'La condición se ha agregado con éxito';
        setTimeout(() => {
          this.hasAdded = false;
          this.messageAlertList = '';
        }, 2000);
      }
    });
  }

  edit(item: any) {
    this.action = 'edit';

    const dialogConfig = new MatDialogConfig();

    dialogConfig.hasBackdrop = true;
    dialogConfig.closeOnNavigation = true;

    dialogConfig.data = {
      title: 'Maestro Oferta: Edición de condición',
      mediosPagosOptions: this.mediosPagosOptions,
      hasCuponOptions: this.hasCuponOptions,
      hasDescuentosOptions: this.hasDescuentosOptions,
      action: this.action,
      formEdit: item,
    };

    const dialogRef = this.dialog.open(DialogCondicionComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (!result) {
        return;
      }

      if (result.edited) {
        this.loaderService.show('Cargando Condiciones...');
        await this.fillDataTable();

        this.hasAdded = true;
        this.messageAlertList = 'El producto se ha modificado con éxito';
        setTimeout(() => {
          this.hasAdded = false;
          this.messageAlertList = '';
        }, 2000);
      }
    });
  }

  applyFilter() {
    const response = this.form.getRawValue();

    this.query = {
      hasCuponOptions:
        response.hasCuponOptions != null ? [response.hasCuponOptions] : [],
      hasDescuentosOptions:
        response.hasDescuentosOptions != null
          ? [response.hasDescuentosOptions]
          : [],
      state: response.state != null ? [response.state] : [],
    };

    this.finalFiltersQueries = this.buildQueryParams();
    this.currentPage = 1;
    this.fillDataTable();

    if (this.sidevarFilter.isOpenedFilter()) {
      this.sidevarFilter.toggle();
    }
  }

  cleanFilter() {
    this.query = {
      hasCuponOptions: [],
      hasDescuentosOptions: [],
      state: [],
    };

    this.form.setValue({
      hasCuponOptions: null,
      hasDescuentosOptions: null,
      state: null,
    });

    this.finalFiltersQueries = this.buildQueryParams();
    this.currentPage = 1;
    this.fillDataTable();

    if (this.sidevarFilter.isOpenedFilter()) {
      this.sidevarFilter.toggle();
    }
  }

  clickItem(filter: any) {
    this.query[filter.field] = this.query[filter.field].filter((item: any) => {
      return item != filter.value;
    });
    this.query = { ...this.query };
    this.form.controls['hasCuponOptions'].setValue(
      this.query.hasCuponOptions[0]
    );
    this.form.controls['hasDescuentosOptions'].setValue(
      this.query.hasDescuentosOptions[0]
    );
    this.form.controls['state'].setValue(this.query.state[0]);

    this.applyFilter();
  }

  buildQueryParams(): string {
    let finalQueryString = '';
    const arrayQueriesToJoin: string[] = [];
    const currentQueryData = { ...this.query };

    Object.entries(currentQueryData).forEach((entry: any) => {
      const [key, element] = entry;
      if (element !== null && element.length > 0) {
        switch (key) {
          case 'hasCuponOptions':
            element.forEach((item: any) => {
              const formatQueryString = `permiteCuponList=${
                item === 1 ? !!true : !!false
              }`;
              arrayQueriesToJoin.push(formatQueryString);
            });
            break;
          case 'hasDescuentosOptions':
            element.forEach((item: any) => {
              const formatQueryString = `permiteDescuentoMonitoreoList=${
                item === 1 ? !!true : !!false
              }`;
              arrayQueriesToJoin.push(formatQueryString);
            });
            break;
          case 'state':
            element.forEach((item: any) => {
              const formatQueryString = `estadoList=${item}`;
              arrayQueriesToJoin.push(formatQueryString);
            });
            break;
        }
      }
    });

    finalQueryString = arrayQueriesToJoin.join('&');
    return finalQueryString;
  }
}
