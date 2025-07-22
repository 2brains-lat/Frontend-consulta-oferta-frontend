import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { LoaderService } from '@verisure/services';
import { OptionColumn, typeColumn } from '../../types';
import { MaestrosOfertaService } from '../maestros-oferta.service';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogProductoComponent } from './dialog-producto/dialog-producto.component';
import { enterLeaveAlertAnimation, enterStateAnimation } from '@verisure/ui';
import { SearchbarListAdminComponent } from '@verisure/ui';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'verisure-maestro-producto',
  templateUrl: './maestro-producto.component.html',
  styleUrls: ['./maestro-producto.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [enterLeaveAlertAnimation, enterStateAnimation],
})
export class MaestroProductoComponent implements OnInit {
  @Input() tabItem!: string;
  displayedColumns: OptionColumn[] = [
    {
      name: 'Descripción',
      type: typeColumn.TEXT,
      value: 'descripcion',
    },
    {
      name: 'Tipo ítem',
      type: typeColumn.TEXT,
      value: 'tipoItemName',
    },
    {
      name: 'Subtipo',
      type: typeColumn.TEXT,
      value: 'subtipoName',
    },
    {
      name: 'ID VS',
      type: typeColumn.TEXT,
      value: 'idVerisure',
    },
    {
      name: 'ID VS Supercuota',
      type: typeColumn.TEXT,
      value: 'idVerisureSuperCuota',
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

  query: any = {
    tipoItemsOptions: [],
    subtiposOptions: [],
  };
  finalFiltersQueries = '';

  @ViewChild('toggle', { static: true }) toggle: any = MatSlideToggle;
  @ViewChild('btn', { static: true }) editBtn: any;
  @ViewChild('searchbar') sidevarFilter!: SearchbarListAdminComponent;

  closeFilters = false;
  action = 'add';
  formSearch!: FormGroup;
  form: FormGroup;

  tipoItemsOptions!: { key: string; value: string }[];
  subtiposOptions!: { key: string; value: string }[];

  catalogs: any = {
    tipoItemsOptions: [],
    subtiposOptions: [],
  };

  labelsCatalog: any = {
    tipoItemsOptions: 'Tipo de ítem',
    subtiposOptions: 'Sub tipo de ítem',
  };

  constructor(
    public fb: FormBuilder,
    private maestrosOfertaService: MaestrosOfertaService,
    private loaderService: LoaderService,
    private dialog: MatDialog
  ) {
    this.formSearch = this.fb.group({
      results: [[]],
    });

    this.form = this.fb.group({
      tipoItemsOptionsCtrl: new FormControl([]),
      subtiposOptionsCtrl: new FormControl([]),
    });

    this.loaderService.show('Cargando Productos...');
    setTimeout(async () => {
      await this.fillDataTable();
      this.loaderService.hide();
    }, 1000);
  }

  ngOnInit(): void {
    forkJoin([
      this.maestrosOfertaService.getTipoItems(),
      this.maestrosOfertaService.getSubtipos(),
    ])
      .pipe()
      .subscribe(([tipoItems, subtipos]) => {
        this.tipoItemsOptions = tipoItems.map((item: any) => ({
          key: item.tipoProductoId,
          value: item.descripcion,
        }));
        this.subtiposOptions = subtipos.map((sub: any) => ({
          key: sub.subtipoProductoId,
          value: sub.descripcion,
        }));

        this.catalogs = {
          tipoItemsOptions: this.tipoItemsOptions,
          subtiposOptions: this.subtiposOptions,
        };
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

  changeToggle(item: any) {
    const resultFormProducto = {
      descripcion: item.descripcion,
      subtipo: item.subtipo.subtipoItemId,
      idVerisureSuperCuota: item.idVerisureSuperCuota,
      idVerisure: item.idVerisure,
      activo: !item.activo,
    };

    this.maestrosOfertaService
      .editMaestrosOfferByProducto(resultFormProducto, item.productoId)
      .subscribe({
        next: (dataResult) => {
          this.fillDataTable();
          this.hasAdded = true;
          this.messageAlertList = 'El producto se ha modificado con éxito';
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

  async fillDataTable(searchQuery?: string) {
    let query =
      this.finalFiltersQueries !== ''
        ? `page=${this.currentPage}&size=${this.itemPerPage}&${this.finalFiltersQueries}`
        : `page=${this.currentPage}&size=${this.itemPerPage}`;

    if (searchQuery && searchQuery !== '') {
      query += `&idVerisure=${searchQuery}`;
    }
    this.sw = false;

    this.maestrosOfertaService.getListProductos(query).subscribe((respProd) => {
      const result = respProd.data.map((ele: any) => ({
        ...ele,
        tipoItemName: ele.tipoItem.glosa,
        subtipoName: ele.subtipo.glosa,
      }));
      this.elementData = result;

      this.totalPaginas = respProd.totalPaginas;
      // itemsPorPagina
      this.totalItems = respProd.totalItems;
      this.sw = true;

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
      title: 'Maestro Oferta: Creación de producto (Pack o Kit)',
      tipoItemsOptions: this.tipoItemsOptions,
      subtypeOptions: this.subtiposOptions,
      action: this.action,
    };

    const dialogRef = this.dialog.open(DialogProductoComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (!result) {
        return;
      }

      if (result.edited) {
        this.loaderService.show('Cargando Productos...');
        await this.fillDataTable();

        this.hasAdded = true;
        this.messageAlertList = 'El producto se ha agregado con éxito';
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
      title: 'Maestro Oferta: Edición de producto (Pack o Kit)',
      tipoItemsOptions: this.tipoItemsOptions,
      subtypeOptions: this.subtiposOptions,
      action: this.action,
      formEdit: item,
    };

    const dialogRef = this.dialog.open(DialogProductoComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (!result) {
        return;
      }

      if (result.edited) {
        this.loaderService.show('Cargando Productos...');
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
      tipoItemsOptions: [...response.tipoItemsOptionsCtrl],
      subtiposOptions: [...response.subtiposOptionsCtrl],
    };

    this.closeFilters = false;
    this.closeFilters = true;

    this.finalFiltersQueries = this.buildQueryParams();
    this.currentPage = 1;
    this.fillDataTable();

    if (this.sidevarFilter.isOpenedFilter()) {
      this.sidevarFilter.toggle();
    }
  }

  cleanFilter() {
    this.query = {
      tipoItemsOptions: [],
      subtiposOptions: [],
    };
    this.form.setValue({
      tipoItemsOptionsCtrl: [],
      subtiposOptionsCtrl: [],
    });

    this.closeFilters = false;
    this.closeFilters = true;

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
    this.form.controls['tipoItemsOptionsCtrl'].setValue(
      this.query.tipoItemsOptions
    );
    this.form.controls['subtiposOptionsCtrl'].setValue(
      this.query.subtiposOptions
    );

    this.applyFilter();
  }

  buildQueryParams(): string {
    let finalQueryString = '';
    const arrayQueriesToJoin: string[] = [];
    const currentQueryData = { ...this.query };

    Object.entries(currentQueryData).forEach((entry: any) => {
      const [key, element] = entry;
      if (element !== null && element.length > 0) {
        if (key === 'tipoItemsOptions') {
          element.forEach((item: any) => {
            const formatQueryString = `tipoList=${item}`;
            arrayQueriesToJoin.push(formatQueryString);
          });
        } else {
          element.forEach((item: any) => {
            const formatQueryString = `subtipoList=${item}`;
            arrayQueriesToJoin.push(formatQueryString);
          });
        }
      }
    });

    finalQueryString = arrayQueriesToJoin.join('&');

    return finalQueryString;
  }
}
