import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { JhipsterTestTestModule } from '../../../test.module';
import { CostesUpdateComponent } from 'app/entities/costes/costes-update.component';
import { CostesService } from 'app/entities/costes/costes.service';
import { Costes } from 'app/shared/model/costes.model';

describe('Component Tests', () => {
  describe('Costes Management Update Component', () => {
    let comp: CostesUpdateComponent;
    let fixture: ComponentFixture<CostesUpdateComponent>;
    let service: CostesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [JhipsterTestTestModule],
        declarations: [CostesUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(CostesUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CostesUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CostesService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Costes(123);
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
        const entity = new Costes();
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
