import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPeticion } from 'app/shared/model/peticion.model';
import { PeticionService } from './peticion.service';

@Component({
  selector: 'jhi-peticion-delete-dialog',
  templateUrl: './peticion-delete-dialog.component.html'
})
export class PeticionDeleteDialogComponent {
  peticion: IPeticion;

  constructor(protected peticionService: PeticionService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.peticionService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'peticionListModification',
        content: 'Deleted an peticion'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-peticion-delete-popup',
  template: ''
})
export class PeticionDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ peticion }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(PeticionDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.peticion = peticion;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/peticion', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/peticion', { outlets: { popup: null } }]);
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
