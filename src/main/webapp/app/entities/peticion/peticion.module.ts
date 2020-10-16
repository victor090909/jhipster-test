import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterTestSharedModule } from 'app/shared/shared.module';
import { PeticionComponent } from './peticion.component';
import { PeticionDetailComponent } from './peticion-detail.component';
import { PeticionUpdateComponent } from './peticion-update.component';
import { PeticionDeleteDialogComponent } from './peticion-delete-dialog.component';
import { peticionRoute } from './peticion.route';

@NgModule({
  imports: [JhipsterTestSharedModule, RouterModule.forChild(peticionRoute)],
  declarations: [PeticionComponent, PeticionDetailComponent, PeticionUpdateComponent, PeticionDeleteDialogComponent],
  entryComponents: [PeticionDeleteDialogComponent],
})
export class JhipsterTestPeticionModule {}
