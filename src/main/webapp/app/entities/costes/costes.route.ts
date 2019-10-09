import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Costes } from 'app/shared/model/costes.model';
import { CostesService } from './costes.service';
import { CostesComponent } from './costes.component';
import { CostesDetailComponent } from './costes-detail.component';
import { CostesUpdateComponent } from './costes-update.component';
import { CostesDeletePopupComponent } from './costes-delete-dialog.component';
import { ICostes } from 'app/shared/model/costes.model';

@Injectable({ providedIn: 'root' })
export class CostesResolve implements Resolve<ICostes> {
  constructor(private service: CostesService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICostes> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Costes>) => response.ok),
        map((costes: HttpResponse<Costes>) => costes.body)
      );
    }
    return of(new Costes());
  }
}

export const costesRoute: Routes = [
  {
    path: '',
    component: CostesComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterTestApp.costes.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: CostesDetailComponent,
    resolve: {
      costes: CostesResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterTestApp.costes.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: CostesUpdateComponent,
    resolve: {
      costes: CostesResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterTestApp.costes.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: CostesUpdateComponent,
    resolve: {
      costes: CostesResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterTestApp.costes.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const costesPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: CostesDeletePopupComponent,
    resolve: {
      costes: CostesResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterTestApp.costes.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
