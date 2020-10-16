import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, SearchWithPagination } from 'app/shared/util/request-util';
import { ICostes } from 'app/shared/model/costes.model';

type EntityResponseType = HttpResponse<ICostes>;
type EntityArrayResponseType = HttpResponse<ICostes[]>;

@Injectable({ providedIn: 'root' })
export class CostesService {
  public resourceUrl = SERVER_API_URL + 'api/costes';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/costes';

  constructor(protected http: HttpClient) {}

  create(costes: ICostes): Observable<EntityResponseType> {
    return this.http.post<ICostes>(this.resourceUrl, costes, { observe: 'response' });
  }

  update(costes: ICostes): Observable<EntityResponseType> {
    return this.http.put<ICostes>(this.resourceUrl, costes, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICostes>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICostes[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICostes[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
