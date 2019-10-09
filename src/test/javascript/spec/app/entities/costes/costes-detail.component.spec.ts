import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { JhipsterTestTestModule } from '../../../test.module';
import { CostesDetailComponent } from 'app/entities/costes/costes-detail.component';
import { Costes } from 'app/shared/model/costes.model';

describe('Component Tests', () => {
  describe('Costes Management Detail Component', () => {
    let comp: CostesDetailComponent;
    let fixture: ComponentFixture<CostesDetailComponent>;
    const route = ({ data: of({ costes: new Costes(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [JhipsterTestTestModule],
        declarations: [CostesDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(CostesDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CostesDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.costes).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
