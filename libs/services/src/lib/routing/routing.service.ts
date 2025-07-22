import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  private history: string[] = [];

  constructor(private router: Router) {}

  public loadRouting(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((elem: any) => {
        this.history = [...this.history, elem.urlAfterRedirects];

        if (this.history[this.history.length - 2] !== undefined) {
          localStorage.setItem(
            'lastUrlVisited',
            this.history[this.history.length - 2]
          );
        }
      });
  }

  get getHistory(): string[] {
    return this.history;
  }

  get getPreviousUrl(): any {
    return (
      this.history[this.history.length - 2] ||
      localStorage.getItem('lastUrlVisited')
    );
  }
}
