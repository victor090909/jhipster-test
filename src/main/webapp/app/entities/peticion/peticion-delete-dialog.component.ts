import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPeticion } from 'app/shared/model/peticion.model';
import { PeticionService } from './peticion.service';

@Component({
  templateUrl: './peticion-delete-dialog.component.html',
})
export class PeticionDeleteDialogComponent {
  peticion?: IPeticion;

  constructor(protected peticionService: PeticionService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.peticionService.delete(id).subscribe(() => {
      this.eventManager.broadcast('peticionListModification');
      this.activeModal.close();
    });
  }
}
