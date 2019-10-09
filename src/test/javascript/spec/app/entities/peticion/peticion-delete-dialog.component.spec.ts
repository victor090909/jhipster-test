import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { JhipsterTestTestModule } from '../../../test.module';
import { PeticionDeleteDialogComponent } from 'app/entities/peticion/peticion-delete-dialog.component';
import { PeticionService } from 'app/entities/peticion/peticion.service';

describe('Component Tests', () => {
  describe('Peticion Management Delete Component', () => {
    let comp: PeticionDeleteDialogComponent;
    let fixture: ComponentFixture<PeticionDeleteDialogComponent>;
    let service: PeticionService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [JhipsterTestTestModule],
        declarations: [PeticionDeleteDialogComponent]
      })
        .overrideTemplate(PeticionDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PeticionDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PeticionService);
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
