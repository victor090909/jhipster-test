import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
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

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ITareas[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateFromClient(tareas: ITareas): ITareas {
    const copy: ITareas = Object.assign({}, tareas, {
      fechafin: tareas.fechafin != null && tareas.fechafin.isValid() ? tareas.fechafin.toJSON() : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fechafin = res.body.fechafin != null ? moment(res.body.fechafin) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((tareas: ITareas) => {
        tareas.fechafin = tareas.fechafin != null ? moment(tareas.fechafin) : null;
      });
    }
    return res;
  }
}
