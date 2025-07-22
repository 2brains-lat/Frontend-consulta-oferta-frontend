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
import { DialogPrecioComponent } from './dialog-precio/dialog-precio.component';
import { enterLeaveAlertAnimation, enterStateAnimation } from '@verisure/ui';
import { SearchbarListAdminComponent } from '@verisure/ui';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'verisure-maestro-precio',
  templateUrl: './maestro-precio.component.html',
  styleUrls: ['./maestro-precio.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [enterLeaveAlertAnimation, enterStateAnimation],
})
export class MaestroPrecioComponent implements OnInit {
  @Input() tabItem!: string;

  displayedColumns: OptionColumn[] = [
    {
      name: 'Producto',
      type: typeColumn.TEXT,
      value: 'productName',
    },
    {
      name: 'ID VS',
      type: typeColumn.TEXT,
      value: 'verisureIdBase',
    },
    {
      name: 'Categoría',
      type: typeColumn.TEXT,
      value: 'categoria',
    },
    {
      name: 'Precio instalación',
      type: typeColumn.TEXT,
      value: 'precioI',
    },
    {
      name: 'Tipo cuota',
      type: typeColumn.TEXT,
      value: 'tipoCuota',
    },
    {
      name: 'Precio monitoreo',
      type: typeColumn.TEXT,
      value: 'precioM',
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
  currentPage = 1;
  totalItems = 0;
  totalPaginas = 0;
  itemPerPage = 10;
  sw = true;
  hasAdded = false;
  messageAlertList = '';
  showMsgErrorProducts = false;

  @ViewChild('toggle', { static: true }) toggle: any = MatSlideToggle;
  @ViewChild('btn', { static: true }) editBtn: any;
  @ViewChild('searchbar') sidevarFilter!: SearchbarListAdminComponent;

  action = 'add';

  formSearch!: FormGroup;
  productosOptions!: { key: string; value: string }[];
  categoriasOptions!: { key: string; value: string }[];
  tipoCuotasOptions!: { key: string; value: string }[];
  tipoMonedasOptions!: { key: string; value: string }[];
  estadoOptions!: { key: string; value: string }[];

  catalogs: any = {
    estadoOptions: [],
    categoriasOptions: [],
  };

  query: any = {
    estadoOptions: [],
    categoriasOptions: [],
  };

  labelsCatalog: any = {
    estadoOptions: 'Estado',
    categoriasOptions: 'Categoría',
  };
  form: FormGroup;

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
      categoriasOptions: new FormControl([]),
      estadoOptions: new FormControl([]),
    });

    this.loaderService.show('Cargando Precios...');
    setTimeout(async () => {
      await this.fillDataTable();
      this.loaderService.hide();
    }, 1000);
  }

  ngOnInit(): void {
    this.estadoOptions = [
      {
        key: '1',
        value: 'Activo',
      },
      {
        key: '0',
        value: 'Inactivo',
      },
    ];

    forkJoin([
      this.maestrosOfertaService.getListProductos({ page: 1, size: 10000 }),
      this.maestrosOfertaService.getTipoCuotas(),
      this.maestrosOfertaService.getCategorias(),
      this.maestrosOfertaService.getTipoMonedas(),
    ])
      .pipe()
      .subscribe(([productos, cuotas, categorias, monedas]) => {
        const productsData = [...productos.data];

        this.tipoCuotasOptions = cuotas.map((ele: any) => ({
          key: ele.tipoCuotaId,
          value: ele.glosa,
        }));

        this.categoriasOptions = categorias.map((ele: any) => ({
          key: ele.categoriaId,
          value: ele.glosa,
        }));

        this.tipoMonedasOptions = monedas.map((ele: any) => ({
          key: ele.parametroId,
          value: ele.glosa,
        }));

        this.catalogs = {
          estadoOptions: this.estadoOptions,
          categoriasOptions: this.categoriasOptions,
        };

        if (productsData.length > 0) {
          this.productosOptions = productsData.map((ele: any) => ({
            key: ele.productoId,
            value: ele.descripcion,
          }));
          this.showMsgErrorProducts = false;
        } else {
          this.showMsgErrorProducts = true;
        }
      });

    this.displayedColumns = this.displayedColumns.map((e) => {
      if (e.value == 'activo') {
        e.template = this.toggle;
      }
      if (e.value == 'editar') {
        e.template = this.editBtn;
      }
      return e;
    });

    this.formSearch.controls['results'].valueChanges.subscribe(
      (searchEvent) => {
        if (searchEvent === '') {
          this.fillDataTable();
        }
      }
    );
  }

  applyFilter() {
    const response = this.form.getRawValue();
    this.query = {
      categoriasOptions: [...response.categoriasOptions],
      estadoOptions: [...response.estadoOptions],
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
      categoriasOptions: [],
      estadoOptions: [],
    };
    this.form.setValue({
      categoriasOptions: [],
      estadoOptions: [],
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
    this.form.controls['categoriasOptions'].setValue(
      this.query.categoriasOptions
    );
    this.form.controls['estadoOptions'].setValue(this.query.estadoOptions);

    this.applyFilter();
  }

  buildQueryParams(): string {
    let finalQueryString = '';
    const arrayQueriesToJoin: string[] = [];
    const currentQueryData = { ...this.query };

    Object.entries(currentQueryData).forEach((entry: any) => {
      const [key, element] = entry;
      if (element !== null && element.length > 0) {
        if (key === 'categoriasOptions') {
          element.forEach((item: any) => {
            const formatQueryString = `categoriaList=${item}`;
            arrayQueriesToJoin.push(formatQueryString);
          });
        } else {
          element.forEach((item: any) => {
            const formatQueryString = `estadoList=${item}`;
            arrayQueriesToJoin.push(formatQueryString);
          });
        }
      }
    });

    finalQueryString = arrayQueriesToJoin.join('&');

    return finalQueryString;
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
    const resultFormPrecio = {
      productoId: item.productoId,
      verisureId: item.verisureId,
      motorReglasId: item.motorReglasId,
      precioInstalacion: {
        precioInstalacionCategoria: item.precioInstalacion.categoriaId,
        precioInstalacion: item.precioInstalacion.precio,
        precioInstalacionMoneda: item.precioInstalacion.moneda,
        precioInstalacionVerisureId: item.precioInstalacion.verisureId,
      },
      precioMonitoreo: {
        precioMonitoreoTipoCuota: item.precioMonitoreo.tipoCuotaId,
        precioMonitoreo: item.precioMonitoreo.precio,
        precioMonitoreoMoneda: item.precioMonitoreo.moneda,
        precioMonitoreoVerisureId: item.precioMonitoreo.verisureId,
      },
      activo: !item.activo,
    };

    this.maestrosOfertaService
      .editMaestrosOfferByPrecio(resultFormPrecio, item.precioId)
      .subscribe({
        next: (dataResult) => {
          this.fillDataTable();
          this.hasAdded = true;
          this.messageAlertList = 'El precio se ha modificado con éxito';
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

    this.maestrosOfertaService.getListPrecios(query).subscribe((respPrecio) => {
      const result = respPrecio.data.map((ele: any) => ({
        ...ele,
        productName: ele.producto.descripcion,
        categoria: ele.precioInstalacion.categoriaObject.glosa,
        categoriaId: ele.precioInstalacion.categoriaId,
        verisureIdBase: ele.verisureId,
        precioI: `${ele.precioInstalacion.monedaObject.glosa}: ${ele.precioInstalacion.precio}`,
        tipoMonedaI: ele.precioInstalacion.monedaObject.glosa,
        precioM: `${ele.precioMonitoreo.precio} ${ele.precioMonitoreo.monedaObject.glosa}`,
        tipoMonedaM: ele.precioMonitoreo.monedaObject.glosa,
        tipoCuota: ele.precioMonitoreo.tipoCuotaObject.glosa,
        verisureIdI: ele.precioInstalacion.verisureId,
        verisureIdM: ele.precioMonitoreo.verisureId,
      }));
      this.elementData = result;

      this.totalPaginas = respPrecio.totalPaginas;
      this.totalItems = respPrecio.totalItems;

      if (this.loaderService.isLoading) {
        this.loaderService.hide();
      }
    });
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
      title: 'Maestro Oferta: Creación de precio',
      productosOptions: this.productosOptions,
      categoriasOptions: this.categoriasOptions,
      tipoCuotasOptions: this.tipoCuotasOptions,
      tipoMonedasOptions: this.tipoMonedasOptions,
      action: this.action,
    };

    const dialogRef = this.dialog.open(DialogPrecioComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (!result) {
        return;
      }

      if (result.edited) {
        this.loaderService.show('Cargando Precios...');
        await this.fillDataTable();

        this.hasAdded = true;
        this.messageAlertList = 'El precio se ha agregado con éxito';
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
      title: 'Maestro Oferta: Edición de precio',
      productosOptions: this.productosOptions,
      categoriasOptions: this.categoriasOptions,
      tipoCuotasOptions: this.tipoCuotasOptions,
      tipoMonedasOptions: this.tipoMonedasOptions,
      action: this.action,
      formEdit: item,
    };

    const dialogRef = this.dialog.open(DialogPrecioComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (!result) {
        return;
      }

      if (result.edited) {
        this.loaderService.show('Cargando Precios...');
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
}
