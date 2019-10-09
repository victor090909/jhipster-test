import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { JhipsterTestTestModule } from '../../../test.module';
import { TareasDeleteDialogComponent } from 'app/entities/tareas/tareas-delete-dialog.component';
import { TareasService } from 'app/entities/tareas/tareas.service';

describe('Component Tests', () => {
  describe('Tareas Management Delete Component', () => {
    let comp: TareasDeleteDialogComponent;
    let fixture: ComponentFixture<TareasDeleteDialogComponent>;
    let service: TareasService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [JhipsterTestTestModule],
        declarations: [TareasDeleteDialogComponent]
      })
        .overrideTemplate(TareasDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TareasDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(TareasService);
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
