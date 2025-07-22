import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ResolveEnd } from '@angular/router';
import { filter } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'verisure-maestros',
  templateUrl: './maestros.component.html',
  styleUrls: ['./maestros.component.scss'],
})
export class MaestrosComponent implements OnInit {
  onChange = '';
  subItemNav: 'oferta' | 'segmento' | 'otros' | string | any = 'oferta';

  tabItems: Array<{ value: string; label: string }> = [];
  formSearch!: FormGroup;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public fb: FormBuilder
  ) {
    this.formSearch = this.fb.group({
      results: [[]],
    });
  }

  ngOnInit(): void {
    this.subItemNav =
      this.activatedRoute?.firstChild?.snapshot.routeConfig?.path;
    this.buildTabsContent();

    this.router.events
      .pipe(filter((event) => event instanceof ResolveEnd))
      .subscribe((event: any) => {
        this.subItemNav = event.url.split('/').reverse()[0];
        this.buildTabsContent();
      });
  }

  buildTabsContent() {
    let newContentTabItem: { value: string; label: string }[] = [];
    switch (this.subItemNav) {
      case 'oferta':
        newContentTabItem = [
          { value: 'producto', label: 'Producto' },
          { value: 'precio', label: 'Precio' },
          { value: 'condiciones', label: 'Condiciones' },
        ];
        break;
      case 'segmento':
        newContentTabItem = [
          { value: 'marketing', label: 'Marketing' },
          { value: 'ventas', label: 'Ventas' },
          { value: 'finanzas', label: 'Finanzas' },
          { value: 'nodo', label: 'Nodo' },
        ];
        break;
      // case 'otros':
      //   No definido aun los posibles casos maestros a desplegar
      //   break;
    }

    // Inicializacion de TabsItem y valor predefinido seleccionado en cada Tab
    this.tabItems = newContentTabItem;
    if (newContentTabItem.length > 0) {
      this.onChange = newContentTabItem[0].value;
    }
  }
}
