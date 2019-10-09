import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Tareas } from 'app/shared/model/tareas.model';
import { TareasService } from './tareas.service';
import { TareasComponent } from './tareas.component';
import { TareasDetailComponent } from './tareas-detail.component';
import { TareasUpdateComponent } from './tareas-update.component';
import { TareasDeletePopupComponent } from './tareas-delete-dialog.component';
import { ITareas } from 'app/shared/model/tareas.model';

@Injectable({ providedIn: 'root' })
export class TareasResolve implements Resolve<ITareas> {
  constructor(private service: TareasService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ITareas> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Tareas>) => response.ok),
        map((tareas: HttpResponse<Tareas>) => tareas.body)
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
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterTestApp.tareas.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: TareasDetailComponent,
    resolve: {
      tareas: TareasResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterTestApp.tareas.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: TareasUpdateComponent,
    resolve: {
      tareas: TareasResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterTestApp.tareas.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: TareasUpdateComponent,
    resolve: {
      tareas: TareasResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterTestApp.tareas.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const tareasPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: TareasDeletePopupComponent,
    resolve: {
      tareas: TareasResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterTestApp.tareas.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
