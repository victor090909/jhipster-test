import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ITareas, Tareas } from 'app/shared/model/tareas.model';
import { TareasService } from './tareas.service';
import { TareasComponent } from './tareas.component';
import { TareasDetailComponent } from './tareas-detail.component';
import { TareasUpdateComponent } from './tareas-update.component';

@Injectable({ providedIn: 'root' })
export class TareasResolve implements Resolve<ITareas> {
  constructor(private service: TareasService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITareas> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((tareas: HttpResponse<Tareas>) => {
          if (tareas.body) {
            return of(tareas.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Tareas());
  }
}

export const tareasRoute: Routes = [
  {
    path: '',
    component: TareasComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'jhipsterTestApp.tareas.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TareasDetailComponent,
    resolve: {
      tareas: TareasResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'jhipsterTestApp.tareas.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TareasUpdateComponent,
    resolve: {
      tareas: TareasResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'jhipsterTestApp.tareas.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TareasUpdateComponent,
    resolve: {
      tareas: TareasResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'jhipsterTestApp.tareas.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
