import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { enterStateAnimation } from '../../animations/enterState';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { InputComponent } from '../../components/input/input.component';
import { ButtonComponent } from '../../components/button/button.component';
import { AlertComponent } from '../../components/alert/alert.component';
import { CardHistoryComponent } from '../../components/card-history/card-history.component';
import { Router } from '@angular/router';
import { ConsultaOfertaService } from '@verisure/services';
import { rutValidator } from '../form-consultarut/utils';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ListMenuComponent } from '../../components/list-menu/list-menu.component';
import { NavLinksContent } from '../../components/utils';
import { RadioButtonComponent } from '../../components/radio-button/radio-button.component';
import { CheckboxComponent } from '../../components/checkbox/checkbox.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'verisure-history',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatSidenavModule,
    MatChipsModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    FormsModule,
    InputComponent,
    ButtonComponent,
    AlertComponent,
    CardHistoryComponent,
    SidebarComponent,
    ListMenuComponent,
    RadioButtonComponent,
    CheckboxComponent,
  ],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [enterStateAnimation],
})
export class HistoryComponent implements OnInit {
  formHistory!: FormGroup;
  currentResults = 0;
  isRutSearched = false;
  myResults: any[] = [];

  itemsPorPagina = 2;
  totalItems!: number;
  currentPage!: number;
  totalPage!: number;
  isLoading = false;
  badgeColor = '#003D2F';

  @ViewChild('filternav') filterNav: MatSidenav | undefined;
  @Output()
  toggleFilterMenu = new EventEmitter();
  filterItems: NavLinksContent = [
    {
      path: 'panel#clientfilter',
      label: 'Tipo Cliente',
      iconUrl: 'assets/icons/icon-arrow-breadcrumb.svg',
      activeIconUrl: 'assets/icons/icon-arrow-breadcrumb.svg',
    },
    {
      path: 'panel#resourcefilter',
      label: 'Tipo Recurso',
      iconUrl: 'assets/icons/icon-arrow-breadcrumb.svg',
      activeIconUrl: 'assets/icons/icon-arrow-breadcrumb.svg',
    },
    {
      path: 'panel#timefilter',
      label: 'Periodo de tiempo',
      iconUrl: 'assets/icons/icon-arrow-breadcrumb.svg',
      activeIconUrl: 'assets/icons/icon-arrow-breadcrumb.svg',
    },
  ];

  windowCurrentWidth!: number;
  titleHeadMenuFilter = 'Filtrar por';

  form!: FormGroup;
  listTimePeriod!: { label: string; value: string }[];
  listClients: { label: string; value: string }[] = [];
  listResources: { label: string; value: string }[] = [];

  keywordsFilters: Array<any> = [];
  formControlChips!: FormGroup;
  hasFiltersChips = false;

  queryData!: {
    rut: string | null;
    client: string | null;
    resource: string | null;
    startDate: string | null;
    endDate: string | null;
    page: number | null;
    size: number | null;
  };

  @HostListener('window:resize', ['$event.target'])
  onResize(event: any) {
    this.windowCurrentWidth = event.innerWidth;
  }

  constructor(
    private router: Router,
    private consultaService: ConsultaOfertaService,
    public fb: FormBuilder
  ) {
    this.formHistory = this.fb.group({
      rut: ['', [Validators.required, rutValidator()]],
      results: [[], [Validators.required]],
    });

    this.form = fb.group({
      client: ['', [Validators.required]],
      resource: ['', Validators.required],
      timePeriod: ['', [Validators.required]],
    });

    this.formControlChips = fb.group({
      chipsFilters: [[], [Validators.required]],
    });
  }

  async ngOnInit() {
    this.windowCurrentWidth = window.innerWidth;

    // LLENADO DE OPCIONES DE FILTRO
    await this.fillFiltersList();

    this.queryData.size = this.itemsPorPagina;
    this.queryData.page = 1;

    const resQueries = this.buildQueryParams();
    console.log('resQueries: ', resQueries);
    const historial = await this.consultaService.getHistory(resQueries); //Todo los datos del historial

    if (historial) {
      this.totalItems = historial.totalItems;
      this.currentPage = historial.pagina;
      this.totalPage = historial.totalPaginas;

      this.formHistory.controls['results'].patchValue(historial.data);
      this.currentResults = this.formHistory.controls['results'].value.length;
    }

    this.myResults = this.formHistory.value.results;

    this.formHistory.controls['rut'].valueChanges.subscribe((newRut) => {
      if (newRut === '') {
        this.resetForm();
      }
    });

    this.formHistory.controls['results'].valueChanges.subscribe((newRes) => {
      this.myResults = newRes;
      this.isLoading = false;
    });
  }

  async fillFiltersList() {
    const [segmentos, recursos] = await Promise.all([
      this.consultaService.getSegmentos(),
      this.consultaService.getRecursos(),
    ]);

    this.listClients =
      !segmentos && segmentos === null
        ? []
        : [
            ...segmentos.map((segmento) => ({
              label: segmento.glosa,
              value: segmento.motorReglasId.toString(),
            })),
          ];

    this.listResources =
      !recursos && recursos === null
        ? []
        : [
            ...recursos.map((segmento) => ({
              label: segmento.glosa,
              value: segmento.motorReglasId.toString(),
            })),
          ];

    this.listTimePeriod = [
      {
        label: 'Últimos 7 días',
        value: '7',
      },
      {
        label: 'Últimos 15 días',
        value: '15',
      },
      {
        label: 'Últimos 30 días',
        value: '30',
      },
      {
        label: 'Últimos 3 meses',
        value: '90',
      },
    ];

    this.queryData = {
      rut: null,
      client: null,
      resource: null,
      startDate: null,
      endDate: null,
      page: null,
      size: null,
    };
  }

  countLastDays(days: string) {
    const today = new Date();
    today.setDate(today.getDate() - parseInt(days));

    const yyyy = today.getFullYear();
    let mm: any = today.getMonth() + 1; // Months start at 0!
    let dd: any = today.getDate();

    if (dd < 10) dd = '0' + dd.toString();
    if (mm < 10) mm = '0' + mm.toString();
    return dd + '-' + mm + '-' + yyyy;
  }

  openFilter(event?: any) {
    this.filterNav?.toggle();
  }

  getNewSearch(event: any) {
    this.isRutSearched = event !== '';
    this.searchNewRut(event);
  }

  openFilterMenu() {
    this.toggleFilterMenu.emit(true);
  }

  getIdFullOffer(idFullOffer: any) {
    const idCodified = btoa(idFullOffer).toString();
    const url = `oferta/${idCodified}`;
    console.log('URL codified deberia ser: ', url);
    this.router.navigateByUrl(url);

    // const idCodified = btoa('1');
    // const url = `oferta/${idCodified}`;
    // this.router.navigate([url]);
  }

  getIdResumeOffer(idResume: any) {
    const idCodified = btoa(idResume).toString();
    const url = `oferta/${idCodified}`;
    console.log('URL codified deberia ser be: ', url);
    this.router.navigate([url], { fragment: '3' });

    // const idCodified = btoa('1');
    // const url = `oferta/${idCodified}`;
    // this.router.navigate([url], { fragment: '3' });
  }

  async loadMoreOrLess() {
    this.isLoading = true;
    this.currentPage += 1;
    this.queryData.page = this.currentPage;
    this.queryData.size = this.itemsPorPagina;

    const resQueries = this.buildQueryParams();
    const historial = await this.consultaService.getHistory(resQueries);
    if (historial) {
      const newResults = historial.data;
      const oldResults = [...this.myResults];

      this.formHistory.patchValue({
        results: oldResults.concat(newResults),
      });

      this.isLoading = false;
    }
  }

  // NUEVA LOGICA...
  async searchNewRut(event: any) {
    const rutSearched = event.replaceAll('.', '').toUpperCase();
    this.queryData.rut = rutSearched;
    const resQueries = this.buildQueryParams();

    const historial = await this.consultaService.getHistory(resQueries);
    if (historial) {
      const newResults = historial.data.filter(
        (res: any) =>
          res.usuario.rut.replaceAll('.', '').toUpperCase() === rutSearched
      );

      this.myResults = newResults;
      this.formHistory.patchValue({
        rut: event,
        results: newResults,
      });
    }
  }

  async resetForm() {
    this.queryData.rut = null;
    const resQueries = this.buildQueryParams();

    const historial = await this.consultaService.getHistory(resQueries);
    if (historial) {
      this.myResults = historial.data;
      this.formHistory.patchValue({
        results: historial.data,
      });
    }
  }

  displaySubMenuFilter(nameSubFilter: string) {
    this.titleHeadMenuFilter = nameSubFilter;
  }

  async applyFilters(event: any, filterChipName?: string) {
    const { client, resource, timePeriod } = this.form.value;

    this.queryData.client = client !== '' ? client : null;
    this.queryData.resource = resource !== '' ? resource : null;
    this.queryData.startDate =
      timePeriod !== '' ? this.countLastDays(timePeriod) : null;
    this.queryData.endDate = timePeriod !== '' ? this.countLastDays('0') : null;

    const resQueries = this.buildQueryParams();
    const historial = await this.consultaService.getHistory(resQueries);

    if (historial) {
      this.myResults = historial.data;
      this.formHistory.patchValue({
        results: historial.data,
      });

      this.addChipFilter(filterChipName);
      this.openFilter();
    }
  }

  addChipFilter(valueName: any) {
    const value = valueName || '';

    if (value && !this.keywordsFilters.includes(valueName)) {
      this.keywordsFilters.push(value);

      this.formControlChips.patchValue({
        chipsFilters: this.keywordsFilters,
      });
    }
  }

  async removeChipsFilters(keyword: string) {
    const index = this.keywordsFilters.indexOf(keyword);

    if (index >= 0) {
      this.keywordsFilters.splice(index, 1);
      switch (keyword) {
        case 'Tipo Cliente':
          this.queryData.client = null;
          this.form.patchValue({ client: '' });
          break;

        case 'Tipo Recurso':
          this.queryData.resource = null;
          this.form.patchValue({
            resource: '',
          });
          break;

        case 'Periodo de tiempo':
          this.queryData.startDate = null;
          this.queryData.endDate = null;
          this.form.patchValue({
            timePeriod: '',
          });
          break;
      }

      const resQueries = this.buildQueryParams();
      const historial = await this.consultaService.getHistory(resQueries);

      if (historial) {
        this.myResults = historial.data;
        this.formHistory.patchValue({
          results: historial.data,
        });
      }
    }
  }

  buildQueryParams(): string {
    let finalQueryString = '';
    const arrayQueriesToJoin: string[] = [];
    const currentQueryData = {
      rut:
        this.queryData && this.queryData?.rut
          ? `rut=${this.queryData.rut}`
          : null,
      client:
        this.queryData && this.queryData?.client
          ? `client=${this.queryData.client}`
          : null,
      resource:
        this.queryData && this.queryData?.resource
          ? `resource=${this.queryData.resource}`
          : null,
      startDate:
        this.queryData && this.queryData?.startDate
          ? `startDate=${this.queryData.startDate}`
          : null,
      endDate:
        this.queryData && this.queryData?.endDate
          ? `endDate=${this.queryData.endDate}`
          : null,
      page:
        this.queryData &&
        this.queryData.page !== null &&
        this.queryData.page > 0
          ? `page=${this.queryData.page}`
          : null,
      size:
        this.queryData &&
        this.queryData.size !== null &&
        this.queryData.size >= 0
          ? `size=${this.queryData.size}`
          : null,
    };

    Object.entries(currentQueryData).forEach((entry) => {
      const [key, element] = entry;
      if (element !== null) {
        const formatQueryString = `${element}`;
        arrayQueriesToJoin.push(formatQueryString);
      }
    });

    finalQueryString = arrayQueriesToJoin.join('&');
    return finalQueryString;
  }

  async cleanFilters(event: any) {
    this.form.reset({
      client: '',
      resource: '',
      timePeriod: '',
    });

    this.formControlChips.reset({
      chipsFilters: [],
    });

    this.queryData = {
      rut: null,
      client: null,
      resource: null,
      startDate: null,
      endDate: null,
      page: null,
      size: null,
    };

    const resQueries = this.buildQueryParams();
    const historial = await this.consultaService.getHistory(resQueries);

    if (historial) {
      this.myResults = historial.data;
      this.formHistory.patchValue({
        results: historial.data,
      });

      this.keywordsFilters = [];
      if (this.filterNav?.opened) {
        this.openFilter();
      }
    }
  }
}
