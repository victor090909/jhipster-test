import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICostes } from 'app/shared/model/costes.model';
import { CostesService } from './costes.service';

@Component({
  templateUrl: './costes-delete-dialog.component.html',
})
export class CostesDeleteDialogComponent {
  costes?: ICostes;

  constructor(protected costesService: CostesService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.costesService.delete(id).subscribe(() => {
      this.eventManager.broadcast('costesListModification');
      this.activeModal.close();
    });
  }
}
