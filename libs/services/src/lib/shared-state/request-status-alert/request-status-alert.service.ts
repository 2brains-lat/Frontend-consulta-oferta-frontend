import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestStatusAlertService {
  requestStatus = new Subject<{ status: number; message: string } | null>();

  success({ status, message }: { status: number; message: string }) {
    this.requestStatus.next({ status: status, message: message });
    setTimeout(() => {
      this.requestStatus.next(null);
    }, 32900);
  }

  fail() {
    this.requestStatus.next(null);
  }
}
