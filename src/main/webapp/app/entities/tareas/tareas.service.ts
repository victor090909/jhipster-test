import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, SearchWithPagination } from 'app/shared/util/request-util';
import { ITareas } from 'app/shared/model/tareas.model';

type EntityResponseType = HttpResponse<ITareas>;
type EntityArrayResponseType = HttpResponse<ITareas[]>;

@Injectable({ providedIn: 'root' })
export class TareasService {
  public resourceUrl = SERVER_API_URL + 'api/tareas';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/tareas';

  constructor(protected http: HttpClient) {}

  create(tareas: ITareas): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tareas);
    return this.http
      .post<ITareas>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(tareas: ITareas): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tareas);
    return this.http
      .put<ITareas>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ITareas>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ITareas[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ITareas[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateFromClient(tareas: ITareas): ITareas {
    const copy: ITareas = Object.assign({}, tareas, {
      fechafin: tareas.fechafin && tareas.fechafin.isValid() ? tareas.fechafin.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fechafin = res.body.fechafin ? moment(res.body.fechafin) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((tareas: ITareas) => {
        tareas.fechafin = tareas.fechafin ? moment(tareas.fechafin) : undefined;
      });
    }
    return res;
  }
}
