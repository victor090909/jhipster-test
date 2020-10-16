import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IPeticion, Peticion } from 'app/shared/model/peticion.model';
import { PeticionService } from './peticion.service';
import { PeticionComponent } from './peticion.component';
import { PeticionDetailComponent } from './peticion-detail.component';
import { PeticionUpdateComponent } from './peticion-update.component';

@Injectable({ providedIn: 'root' })
export class PeticionResolve implements Resolve<IPeticion> {
  constructor(private service: PeticionService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPeticion> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((peticion: HttpResponse<Peticion>) => {
          if (peticion.body) {
            return of(peticion.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Peticion());
  }
}

export const peticionRoute: Routes = [
  {
    path: '',
    component: PeticionComponent,
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'jhipsterTestApp.peticion.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PeticionDetailComponent,
    resolve: {
      peticion: PeticionResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'jhipsterTestApp.peticion.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PeticionUpdateComponent,
    resolve: {
      peticion: PeticionResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'jhipsterTestApp.peticion.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PeticionUpdateComponent,
    resolve: {
      peticion: PeticionResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'jhipsterTestApp.peticion.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
