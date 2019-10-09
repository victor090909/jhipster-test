import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterTestSharedModule } from 'app/shared/shared.module';
import { CostesComponent } from './costes.component';
import { CostesDetailComponent } from './costes-detail.component';
import { CostesUpdateComponent } from './costes-update.component';
import { CostesDeletePopupComponent, CostesDeleteDialogComponent } from './costes-delete-dialog.component';
import { costesRoute, costesPopupRoute } from './costes.route';

const ENTITY_STATES = [...costesRoute, ...costesPopupRoute];

@NgModule({
  imports: [JhipsterTestSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [CostesComponent, CostesDetailComponent, CostesUpdateComponent, CostesDeleteDialogComponent, CostesDeletePopupComponent],
  entryComponents: [CostesDeleteDialogComponent]
})
export class JhipsterTestCostesModule {}
