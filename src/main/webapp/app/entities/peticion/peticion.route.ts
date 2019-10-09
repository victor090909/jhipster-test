import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Peticion } from 'app/shared/model/peticion.model';
import { PeticionService } from './peticion.service';
import { PeticionComponent } from './peticion.component';
import { PeticionDetailComponent } from './peticion-detail.component';
import { PeticionUpdateComponent } from './peticion-update.component';
import { PeticionDeletePopupComponent } from './peticion-delete-dialog.component';
import { IPeticion } from 'app/shared/model/peticion.model';

@Injectable({ providedIn: 'root' })
export class PeticionResolve implements Resolve<IPeticion> {
  constructor(private service: PeticionService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPeticion> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Peticion>) => response.ok),
        map((peticion: HttpResponse<Peticion>) => peticion.body)
      );
    }
    return of(new Peticion());
  }
}

export const peticionRoute: Routes = [
  {
    path: '',
    component: PeticionComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'jhipsterTestApp.peticion.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: PeticionDetailComponent,
    resolve: {
      peticion: PeticionResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterTestApp.peticion.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: PeticionUpdateComponent,
    resolve: {
      peticion: PeticionResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterTestApp.peticion.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: PeticionUpdateComponent,
    resolve: {
      peticion: PeticionResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterTestApp.peticion.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const peticionPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: PeticionDeletePopupComponent,
    resolve: {
      peticion: PeticionResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterTestApp.peticion.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
