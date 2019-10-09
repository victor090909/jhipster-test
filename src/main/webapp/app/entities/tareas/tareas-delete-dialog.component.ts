import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ITareas } from 'app/shared/model/tareas.model';
import { TareasService } from './tareas.service';

@Component({
  selector: 'jhi-tareas-delete-dialog',
  templateUrl: './tareas-delete-dialog.component.html'
})
export class TareasDeleteDialogComponent {
  tareas: ITareas;

  constructor(protected tareasService: TareasService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.tareasService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'tareasListModification',
        content: 'Deleted an tareas'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-tareas-delete-popup',
  template: ''
})
export class TareasDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ tareas }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(TareasDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.tareas = tareas;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/tareas', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/tareas', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
