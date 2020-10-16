import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ICostes, Costes } from 'app/shared/model/costes.model';
import { CostesService } from './costes.service';
import { CostesComponent } from './costes.component';
import { CostesDetailComponent } from './costes-detail.component';
import { CostesUpdateComponent } from './costes-update.component';

@Injectable({ providedIn: 'root' })
export class CostesResolve implements Resolve<ICostes> {
  constructor(private service: CostesService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICostes> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((costes: HttpResponse<Costes>) => {
          if (costes.body) {
            return of(costes.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
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
      authorities: [Authority.USER],
      pageTitle: 'jhipsterTestApp.costes.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CostesDetailComponent,
    resolve: {
      costes: CostesResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'jhipsterTestApp.costes.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CostesUpdateComponent,
    resolve: {
      costes: CostesResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'jhipsterTestApp.costes.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CostesUpdateComponent,
    resolve: {
      costes: CostesResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'jhipsterTestApp.costes.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
