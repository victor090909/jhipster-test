import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { JhipsterTestTestModule } from '../../../test.module';
import { TareasUpdateComponent } from 'app/entities/tareas/tareas-update.component';
import { TareasService } from 'app/entities/tareas/tareas.service';
import { Tareas } from 'app/shared/model/tareas.model';

describe('Component Tests', () => {
  describe('Tareas Management Update Component', () => {
    let comp: TareasUpdateComponent;
    let fixture: ComponentFixture<TareasUpdateComponent>;
    let service: TareasService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [JhipsterTestTestModule],
        declarations: [TareasUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(TareasUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TareasUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(TareasService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Tareas(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new Tareas();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
