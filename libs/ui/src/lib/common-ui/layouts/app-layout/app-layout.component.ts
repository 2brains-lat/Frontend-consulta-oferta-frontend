import {
  Component,
  Input,
  ViewEncapsulation,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ListMenuComponent } from '../../components/list-menu/list-menu.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NavLinksContent } from '../../components/utils';
import { AuthService } from '@verisure/services';
@Component({
  selector: 'verisure-app-layout',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    ListMenuComponent,
    NavbarComponent,
    MatToolbarModule,
    MatSidenavModule,
    SidebarComponent,
  ],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss'],
})
export class AppLayoutComponent {
  screenWidth = 0;
  smallIconNavbarStatus = false;
  constructor(private authService: AuthService) {}
  @Input()
  set navigateItems(item: NavLinksContent) {
    this._navigateItems = item;
    this.navigateItemsOnlyIcon = item.map((e) => ({
      path: e.path,
      label: '',
      iconUrl: e.iconUrl,
      activeIconUrl: e.activeIconUrl,
    }));
  }
  get navigateItems(): NavLinksContent {
    return this._navigateItems;
  }
  private _navigateItems: NavLinksContent = [
    {
      path: '',
      label: '',
      iconUrl: '',
      activeIconUrl: '',
    },
  ];
  navigateItemsOnlyIcon!: NavLinksContent;

  ngOnInit() {
    this.onResize();
  }
  changeMenuSize() {
    this.smallIconNavbarStatus = !this.smallIconNavbarStatus;
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    if (window.innerWidth >= 768) this.smallIconNavbarStatus = false;
  }
  exitSession = () => {
    this.authService.logOut();
  };
}
