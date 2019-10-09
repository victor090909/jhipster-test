import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { JhipsterTestTestModule } from '../../../test.module';
import { PeticionUpdateComponent } from 'app/entities/peticion/peticion-update.component';
import { PeticionService } from 'app/entities/peticion/peticion.service';
import { Peticion } from 'app/shared/model/peticion.model';

describe('Component Tests', () => {
  describe('Peticion Management Update Component', () => {
    let comp: PeticionUpdateComponent;
    let fixture: ComponentFixture<PeticionUpdateComponent>;
    let service: PeticionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [JhipsterTestTestModule],
        declarations: [PeticionUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(PeticionUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PeticionUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PeticionService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Peticion(123);
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
        const entity = new Peticion();
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
