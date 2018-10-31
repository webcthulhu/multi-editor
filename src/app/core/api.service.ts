import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {PRODUCTS} from '../shared/data/products';
import {of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private static readonly SERVER = environment.server;
  private static readonly API = {
    GET_PRODUCTS: 'api/products',
    GET_DESIGN: 'api/designs/',
    POST_DESIGN: 'api/designs/'
  };
  constructor(private http: HttpClient) { }
  getDesign(id: string) {
    return this.http.get([ApiService.SERVER, ApiService.API.GET_DESIGN, id].join('/'));
  }
  getProducts() {
    return of(PRODUCTS);
    // return this.http.get([ApiService.SERVER, ApiService.API.GET_PRODUCTS].join('/'));
  }
  postDesign(payload) {
    console.log(payload);
    // this.http.post([ApiService.SERVER, ApiService.API.GET_DESIGN, id].join('/'), {}, {}).subscribe((res) => {
    //   console.log(res);
    // });
  }
}
