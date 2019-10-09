import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterTestSharedModule } from 'app/shared/shared.module';
import { TareasComponent } from './tareas.component';
import { TareasDetailComponent } from './tareas-detail.component';
import { TareasUpdateComponent } from './tareas-update.component';
import { TareasDeletePopupComponent, TareasDeleteDialogComponent } from './tareas-delete-dialog.component';
import { tareasRoute, tareasPopupRoute } from './tareas.route';

const ENTITY_STATES = [...tareasRoute, ...tareasPopupRoute];

@NgModule({
  imports: [JhipsterTestSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [TareasComponent, TareasDetailComponent, TareasUpdateComponent, TareasDeleteDialogComponent, TareasDeletePopupComponent],
  entryComponents: [TareasDeleteDialogComponent]
})
export class JhipsterTestTareasModule {}
