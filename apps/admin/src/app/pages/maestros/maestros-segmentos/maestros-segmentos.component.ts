import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MaestrosSegmentoService } from './maestros-segmentos.service';
import { DOCUMENT } from '@angular/common';
import { maestroSegmentos } from './config-table';
import { LoaderService } from '@verisure/services';
import { enterLeaveAlertAnimation, enterStateAnimation } from '@verisure/ui';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogSegmentsComponent } from './dialog-segmentos/dialog-segmentos.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'verisure-maestros-segmentos',
  templateUrl: './maestros-segmentos.component.html',
  styleUrls: ['./maestros-segmentos.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [enterLeaveAlertAnimation, enterStateAnimation],
})
export class MaestrosSegmentosComponent implements OnInit, AfterViewInit {
  displayedColumns = maestroSegmentos;
  elementData: any = [];

  @ViewChild('toggle', { static: true }) toggle: any = MatSlideToggle;
  @ViewChild('btn', { static: true }) editBtn: any;
  @ViewChild('group', { static: true }) group: any;

  modal: any;
  // pagination
  currentPage = 1;
  totalItems = 0;
  totalPaginas = 0;
  itemPerPage = 10;

  sw = true;

  formSearch!: FormGroup;
  form!: FormGroup;
  tabItems = [
    {
      value: '5',
      label: 'Marketing',
      url: '/marketing-segments',
      agrupacion: 'Segmento marketing',
    },
    {
      value: '6',
      label: 'Ventas',
      url: '/sale-segments',
      agrupacion: 'Segmento ventas',
    },
    {
      value: '7',
      label: 'Finanzas',
      url: '/finance-segments',
      agrupacion: 'Grupo finanzas',
    },
    {
      value: '8',
      label: 'Nodo',
      url: '/node-segments',
      agrupacion: 'Nodo finanzas',
    },
  ];
  title = 'Marketing';
  itemSelect = '5';
  itemTableText: any = null;
  tabSelect: any;
  document: Document;
  objItems: any = {};
  action = 'add';
  auxId = '';

  textAlert = 'El segmento se ha agregado con éxito';

  hasAdded = false;
  constructor(
    public fb: FormBuilder,
    private loaderService: LoaderService,
    private maestrosSegmentosService: MaestrosSegmentoService,
    @Inject(DOCUMENT) document: Document,
    private titleHead: Title,
    private dialog: MatDialog
  ) {
    this.titleHead.setTitle(
      'Maestro Segmento | Admin | Consulta oferta Verisure'
    );

    this.document = document;
    this.formSearch = this.fb.group({
      results: [],
    });
    this.form = this.fb.group({
      motorReglasId: new FormControl(null, Validators.required),
      verisureId: new FormControl(null, Validators.required),
      glosa: new FormControl(null, Validators.required),
      agrupacionId: new FormControl(),
      agrupacion: new FormControl(),
      descripcion: new FormControl(),
    });

    this.tabItems.forEach((data) => {
      this.objItems[data.value] = data;
    });
    setTimeout(() => {
      this.itemSelect = '5';
      this.changeTap(this.itemSelect);
    }, 100);
  }

  ngOnInit(): void {
    this.displayedColumns = this.displayedColumns.map((e) => {
      if (e.value == 'activo') {
        e.template = this.toggle;
      }
      if (e.value == 'editar') {
        e.template = this.editBtn;
      }
      if (e.value == 'agrupacionId') {
        e.template = this.group;
      }
      return e;
    });

    this.formSearch.controls['results'].valueChanges.subscribe(
      (searchEvent) => {
        if (searchEvent === '') {
          this.loadData();
        }
      }
    );
  }

  ngAfterViewInit(): void {
    this.modal = this.document.getElementById('modal');
  }

  changeToggle(item: any) {
    item.activo = !item.activo;

    this.maestrosSegmentosService
      .editMaestrosBySegmento(this.tabSelect, {data:item})
      .subscribe((resp) => {
        this.loadData();
        this.modal.close();
      });
  }

  edit(item: any) {
    this.action = 'edit';
    this.auxId = item.segmentoId;
  }

  nextPage() {
    this.currentPage++;
    this.loadData();
  }

  prevPage() {
    this.currentPage--;
    this.loadData();
  }

  changeLimit(data: any) {
    this.itemPerPage = data;
    this.loadData();
  }

  changeTap(data: any) {
    this.tabSelect = this.tabItems.filter((item) => item.value == data)[0];
    this.title = this.tabSelect.label;
    this.itemSelect = data;
    this.itemTableText = this.tabSelect.agrupacion;
    this.form.get('agrupacion')?.setValue(this.itemTableText);
    this.resetParams();
    setTimeout(() => {
      this.loadData();
    }, 100);
  }

  getNewSearch(dataSearch: any) {
    this.currentPage = 1;
    this.loadData(dataSearch);
  }

  clickItem(obj: any) {
    const data = {
      config: {
        title: 'Maestro Oferta: Creación de condición',
        action: 'add',
        tabSelect: this.tabSelect,
      },
      seed: {
        agrupacion: this.itemTableText,
        agrupacionId: this.itemSelect,
      },
    };
    this.openModal(data);
  }

  async loadData(searchQuery?: any) {
    const query =
      searchQuery && searchQuery !== ''
        ? `page=${this.currentPage}&size=${this.itemPerPage}&motorReglasId=${searchQuery}`
        : `page=${this.currentPage}&size=${this.itemPerPage}`;

    this.sw = false;

    this.loaderService.show('Cargando los datos...');
    this.maestrosSegmentosService
      .getMaestrosBySegmento(this.tabSelect, query)
      .subscribe((response: any) => {
        this.elementData = [...response.data];
        this.totalPaginas = response.totalPaginas;
        this.totalItems = response.totalItems;
        this.sw = true;
        setTimeout(() => {
          this.loaderService.hide();
        }, 500);
      });
  }

  closeModal() {
    this.modal.close();
  }

  resetParams() {
    this.currentPage = 1;
    this.totalItems = 0;
    this.totalPaginas = 0;
    this.itemPerPage = 10;
  }

  editData(obj: any) {
    const data = {
      config: {
        title: 'Maestro Oferta: Creación de condición',
        action: 'edit',
        tabSelect: this.tabSelect,
      },
      seed: {
        ...obj,
      },
    };

    this.openModal(data);
  }

  openModal(obj: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.hasBackdrop = true;
    dialogConfig.closeOnNavigation = true;

    dialogConfig.data = {
      config: obj.config,
      seed: obj.seed,
    };

    const dialogRef = this.dialog.open(DialogSegmentsComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) {
        return;
      }

      if (result.edited) {
        this.setTextAlert();
        this.hasAdded = true;
        setTimeout(() => {
          this.textAlert = '';
          this.hasAdded = false;
        }, 2000);

        this.loadData();
      }
    });
  }

  setTextAlert() {
    this.textAlert = `El segmento ${this.title} se ha ${
      this.action == 'add' ? 'agregado' : 'editado'
    } con éxito`;
  }
}
