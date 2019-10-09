import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterTestSharedModule } from 'app/shared/shared.module';
import { PeticionComponent } from './peticion.component';
import { PeticionDetailComponent } from './peticion-detail.component';
import { PeticionUpdateComponent } from './peticion-update.component';
import { PeticionDeletePopupComponent, PeticionDeleteDialogComponent } from './peticion-delete-dialog.component';
import { peticionRoute, peticionPopupRoute } from './peticion.route';

const ENTITY_STATES = [...peticionRoute, ...peticionPopupRoute];

@NgModule({
  imports: [JhipsterTestSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    PeticionComponent,
    PeticionDetailComponent,
    PeticionUpdateComponent,
    PeticionDeleteDialogComponent,
    PeticionDeletePopupComponent
  ],
  entryComponents: [PeticionDeleteDialogComponent]
})
export class JhipsterTestPeticionModule {}
