import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { JhipsterTestTestModule } from '../../../test.module';
import { CostesDeleteDialogComponent } from 'app/entities/costes/costes-delete-dialog.component';
import { CostesService } from 'app/entities/costes/costes.service';

describe('Component Tests', () => {
  describe('Costes Management Delete Component', () => {
    let comp: CostesDeleteDialogComponent;
    let fixture: ComponentFixture<CostesDeleteDialogComponent>;
    let service: CostesService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [JhipsterTestTestModule],
        declarations: [CostesDeleteDialogComponent]
      })
        .overrideTemplate(CostesDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CostesDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CostesService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
      mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));
    });
  });
});
