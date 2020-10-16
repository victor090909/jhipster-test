import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterTestSharedModule } from 'app/shared/shared.module';
import { TareasComponent } from './tareas.component';
import { TareasDetailComponent } from './tareas-detail.component';
import { TareasUpdateComponent } from './tareas-update.component';
import { TareasDeleteDialogComponent } from './tareas-delete-dialog.component';
import { tareasRoute } from './tareas.route';

@NgModule({
  imports: [JhipsterTestSharedModule, RouterModule.forChild(tareasRoute)],
  declarations: [TareasComponent, TareasDetailComponent, TareasUpdateComponent, TareasDeleteDialogComponent],
  entryComponents: [TareasDeleteDialogComponent],
})
export class JhipsterTestTareasModule {}
