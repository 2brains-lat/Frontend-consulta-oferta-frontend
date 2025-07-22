import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@verisure/services';
import { environment } from 'environments/environment';
import { from, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MaestrosOfertaService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  getTipoItems(): Observable<any> {
    const url = `${environment.apigateway_url}/product-types`;
    return from(this.authService.currentAuthToken).pipe(
      switchMap((token) => {
        return this.http.get(url, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            
            Authorization: 'Bearer ' + token,
          },
        });
      })
    );
  }

  getSubtipos(idTipoItem?: any): Observable<any> {
    const url = idTipoItem
      ? `${environment.apigateway_url}/product-types/${idTipoItem}/product-subtypes`
      : `${environment.apigateway_url}/product-subtypes`;
    return from(this.authService.currentAuthToken).pipe(
      switchMap((token) => {
        return this.http.get(url, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            
            Authorization: 'Bearer ' + token,
          },
        });
      })
    );
  }

  getTipoCuotas(): Observable<any> {
    const url = `${environment.apigateway_url}/fee-types`;
    return from(this.authService.currentAuthToken).pipe(
      switchMap((token) => {
        return this.http.get(url, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            
            Authorization: 'Bearer ' + token,
          },
        });
      })
    );
  }

  getCategorias(): Observable<any> {
    const url = `${environment.apigateway_url}/categories`;
    return from(this.authService.currentAuthToken).pipe(
      switchMap((token) => {
        return this.http.get(url, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            
            Authorization: 'Bearer ' + token,
          },
        });
      })
    );
  }

  getTipoMonedas(): Observable<any> {
    const url = `${environment.apigateway_url}/parameters?parameterType=MONEDA`;
    return from(this.authService.currentAuthToken).pipe(
      switchMap((token) => {
        return this.http.get(url, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            
            Authorization: 'Bearer ' + token,
          },
        });
      })
    );
  }

  getMetodosPagos(): Observable<any> {
    const url = `${environment.apigateway_url}/payment-methods?paymentMethodType=MEDIO_PAGO_INSTALACION`;
    return from(this.authService.currentAuthToken).pipe(
      switchMap((token) => {
        return this.http.get(url, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            
            Authorization: 'Bearer ' + token,
          },
        });
      })
    );
  }

  /* *
   * PRODUCTOS CRUD
   * */

  getListProductos(query?: any, idProducto = null): Observable<any> {
    const url = `${environment.apigateway_url}/products?${new URLSearchParams(
      query
    ).toString()}`;
    return from(this.authService.currentAuthToken).pipe(
      switchMap((token) => {
        return this.http.get(url, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            
            Authorization: 'Bearer ' + token,
          },
        });
      })
    );
  }

  saveMaestrosOfferByProducto(newData: any): Observable<any> {
    const url = `${environment.apigateway_url}/products`;
    return from(this.authService.currentAuthToken).pipe(
      switchMap((token) => {
        return this.http.post(url, newData, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            
            Authorization: 'Bearer ' + token,
          },
        });
      })
    );
  }

  editMaestrosOfferByProducto(newData: any, id?: string): Observable<any> {
    const url = `${environment.apigateway_url}/products/${id}`;
    return from(this.authService.currentAuthToken).pipe(
      switchMap((token) => {
        return this.http.patch(url, newData, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            
            Authorization: 'Bearer ' + token,
          },
        });
      })
    );
  }

  /* *
   * PRECIOS CRUD
   * */

  getListPrecios(query?: any, idPrecio = null): Observable<any> {
    const url = `${environment.apigateway_url}/prices?${new URLSearchParams(
      query
    ).toString()}`;
    return from(this.authService.currentAuthToken).pipe(
      switchMap((token) => {
        return this.http.get(url, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            
            Authorization: 'Bearer ' + token,
          },
        });
      })
    );
  }

  saveMaestrosOfferByPrecio(newData: any): Observable<any> {
    const url = `${environment.apigateway_url}/prices`;
    return from(this.authService.currentAuthToken).pipe(
      switchMap((token) => {
        return this.http.post(url, newData, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            
            Authorization: 'Bearer ' + token,
          },
        });
      })
    );
  }

  editMaestrosOfferByPrecio(newData: any, id?: string): Observable<any> {
    const url = `${environment.apigateway_url}/prices/${id}`;
    return from(this.authService.currentAuthToken).pipe(
      switchMap((token) => {
        return this.http.patch(url, newData, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            
            Authorization: 'Bearer ' + token,
          },
        });
      })
    );
  }

  /* *
   * CONDICIONES CRUD
   * */
  getListCondiciones(query?: any, idCondicion = null): Observable<any> {
    const url = `${environment.apigateway_url}/conditions?${new URLSearchParams(
      query
    ).toString()}`;
    return from(this.authService.currentAuthToken).pipe(
      switchMap((token) => {
        return this.http.get(url, {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        });
      })
    );
  }

  saveMaestrosOfferByCondicion(newData: any): Observable<any> {
    const url = `${environment.apigateway_url}/conditions`;
    return from(this.authService.currentAuthToken).pipe(
      switchMap((token) => {
        return this.http.post(url, newData, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            
            Authorization: 'Bearer ' + token,
          },
        });
      })
    );
  }

  editMaestrosOfferByCondicion(newData: any, id?: string): Observable<any> {
    const url = `${environment.apigateway_url}/conditions/${id}`;
    return from(this.authService.currentAuthToken).pipe(
      switchMap((token) => {
        return this.http.patch(url, newData, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            
            Authorization: 'Bearer ' + token,
          },
        });
      })
    );
  }
}
