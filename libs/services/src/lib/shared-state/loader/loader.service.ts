import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  isLoading = new Subject<boolean>();
  loaderMssg = new Subject<string>();

  show(message: string) {
    this.loaderMssg.next(message);
    this.isLoading.next(true);
  }

  hide() {
    this.loaderMssg.next('');
    this.isLoading.next(false);
  }
}
