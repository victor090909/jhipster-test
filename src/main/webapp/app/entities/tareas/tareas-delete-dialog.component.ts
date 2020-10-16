import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ITareas } from 'app/shared/model/tareas.model';
import { TareasService } from './tareas.service';

@Component({
  templateUrl: './tareas-delete-dialog.component.html',
})
export class TareasDeleteDialogComponent {
  tareas?: ITareas;

  constructor(protected tareasService: TareasService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.tareasService.delete(id).subscribe(() => {
      this.eventManager.broadcast('tareasListModification');
      this.activeModal.close();
    });
  }
}
