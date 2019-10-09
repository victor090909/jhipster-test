import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICostes } from 'app/shared/model/costes.model';
import { CostesService } from './costes.service';

@Component({
  selector: 'jhi-costes-delete-dialog',
  templateUrl: './costes-delete-dialog.component.html'
})
export class CostesDeleteDialogComponent {
  costes: ICostes;

  constructor(protected costesService: CostesService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.costesService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'costesListModification',
        content: 'Deleted an costes'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-costes-delete-popup',
  template: ''
})
export class CostesDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ costes }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(CostesDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.costes = costes;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/costes', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/costes', { outlets: { popup: null } }]);
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
