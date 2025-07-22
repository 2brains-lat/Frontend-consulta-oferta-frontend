import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@verisure/services';

import { environment } from 'environments/environment';
import { Observable, from, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MaestrosSegmentoService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getMaestrosBySegmento(tab: any, query: any): Observable<any> {
    const url = `${environment.apigateway_url}${tab.url}?${new URLSearchParams(
      query
    ).toString()}`;
    return from(this.authService.currentAuthToken).pipe(
      switchMap((token) => {
        console.log('token');
        console.log(token);
        return this.http.get(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            
          },
        });
      })
    );
  }

  saveMaestrosBySegmento(tab: any, data: any): Observable<any> {
    const url = `${environment.apigateway_url}${tab.url}`;
    return from(this.authService.currentAuthToken).pipe(
      switchMap((token) => {
        return this.http.post(url, data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            
          },
        });
      })
    );
  }

  editMaestrosBySegmento(tab: any, data: any): Observable<any> {
    const url = `${environment.apigateway_url}${tab.url}/${data?.data.segmentoId}`;
    return from(this.authService.currentAuthToken).pipe(
      switchMap((token) => {
        return this.http.patch(url, {...data.data, edited: data?.edited ?? false }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            
          },
        });
      })
    );
  }
}
