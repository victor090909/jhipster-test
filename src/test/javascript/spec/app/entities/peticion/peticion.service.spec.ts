import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { take, map } from 'rxjs/operators';
import { PeticionService } from 'app/entities/peticion/peticion.service';
import { IPeticion, Peticion } from 'app/shared/model/peticion.model';
import { Tipo } from 'app/shared/model/enumerations/tipo.model';
import { Estado } from 'app/shared/model/enumerations/estado.model';

describe('Service Tests', () => {
  describe('Peticion Service', () => {
    let injector: TestBed;
    let service: PeticionService;
    let httpMock: HttpTestingController;
    let elemDefault: IPeticion;
    let expectedResult;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = {};
      injector = getTestBed();
      service = injector.get(PeticionService);
      httpMock = injector.get(HttpTestingController);

      elemDefault = new Peticion(0, 'AAAAAAA', Tipo.PROYECTO, 'AAAAAAA', 'AAAAAAA', Estado.NUEVA, 'AAAAAAA');
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);
        service
          .find(123)
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: elemDefault });
      });

      it('should create a Peticion', () => {
        const returnedFromService = Object.assign(
          {
            id: 0
          },
          elemDefault
        );
        const expected = Object.assign({}, returnedFromService);
        service
          .create(new Peticion(null))
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should update a Peticion', () => {
        const returnedFromService = Object.assign(
          {
            codigo: 'BBBBBB',
            tipo: 'BBBBBB',
            asunto: 'BBBBBB',
            descripcion: 'BBBBBB',
            estado: 'BBBBBB',
            propietario: 'BBBBBB'
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);
        service
          .update(expected)
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should return a list of Peticion', () => {
        const returnedFromService = Object.assign(
          {
            codigo: 'BBBBBB',
            tipo: 'BBBBBB',
            asunto: 'BBBBBB',
            descripcion: 'BBBBBB',
            estado: 'BBBBBB',
            propietario: 'BBBBBB'
          },
          elemDefault
        );
        const expected = Object.assign({}, returnedFromService);
        service
          .query(expected)
          .pipe(
            take(1),
            map(resp => resp.body)
          )
          .subscribe(body => (expectedResult = body));
        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Peticion', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
