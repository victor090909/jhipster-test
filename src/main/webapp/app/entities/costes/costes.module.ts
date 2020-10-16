import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterTestSharedModule } from 'app/shared/shared.module';
import { CostesComponent } from './costes.component';
import { CostesDetailComponent } from './costes-detail.component';
import { CostesUpdateComponent } from './costes-update.component';
import { CostesDeleteDialogComponent } from './costes-delete-dialog.component';
import { costesRoute } from './costes.route';

@NgModule({
  imports: [JhipsterTestSharedModule, RouterModule.forChild(costesRoute)],
  declarations: [CostesComponent, CostesDetailComponent, CostesUpdateComponent, CostesDeleteDialogComponent],
  entryComponents: [CostesDeleteDialogComponent],
})
export class JhipsterTestCostesModule {}
