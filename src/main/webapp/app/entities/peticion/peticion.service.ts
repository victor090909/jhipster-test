import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IPeticion } from 'app/shared/model/peticion.model';

type EntityResponseType = HttpResponse<IPeticion>;
type EntityArrayResponseType = HttpResponse<IPeticion[]>;

@Injectable({ providedIn: 'root' })
export class PeticionService {
  public resourceUrl = SERVER_API_URL + 'api/peticions';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/peticions';

  constructor(protected http: HttpClient) {}

  create(peticion: IPeticion): Observable<EntityResponseType> {
    return this.http.post<IPeticion>(this.resourceUrl, peticion, { observe: 'response' });
  }

  update(peticion: IPeticion): Observable<EntityResponseType> {
    return this.http.put<IPeticion>(this.resourceUrl, peticion, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPeticion>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPeticion[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPeticion[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
