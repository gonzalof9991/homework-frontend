import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly _API_URL: string = '';
  private _http = inject(HttpClient);

  constructor() {
    this._API_URL = environment.apiUrl;
  }

  public get<T>(path: string): Observable<T> {
    return this._http.get<T>(`${this._API_URL}${path}`);
  }

  public post<T>(path: string, data: any): Observable<T> {
    return this._http.post<T>(`${this._API_URL}${path}`, data);
  }

  public put<T>(path: string, data: any): Observable<T> {
    return this._http.put<T>(`${this._API_URL}${path}`, data);
  }

  public delete<T>(path: string): Observable<T> {
    return this._http.delete<T>(`${this._API_URL}${path}`);
  }
}
