import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { JhipsterTestTestModule } from '../../../test.module';
import { TareasDetailComponent } from 'app/entities/tareas/tareas-detail.component';
import { Tareas } from 'app/shared/model/tareas.model';

describe('Component Tests', () => {
  describe('Tareas Management Detail Component', () => {
    let comp: TareasDetailComponent;
    let fixture: ComponentFixture<TareasDetailComponent>;
    const route = ({ data: of({ tareas: new Tareas(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [JhipsterTestTestModule],
        declarations: [TareasDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(TareasDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TareasDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load tareas on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.tareas).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
