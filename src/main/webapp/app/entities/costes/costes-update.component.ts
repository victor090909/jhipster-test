import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ICostes, Costes } from 'app/shared/model/costes.model';
import { CostesService } from './costes.service';
import { IPeticion } from 'app/shared/model/peticion.model';
import { PeticionService } from 'app/entities/peticion/peticion.service';

@Component({
  selector: 'jhi-costes-update',
  templateUrl: './costes-update.component.html'
})
export class CostesUpdateComponent implements OnInit {
  isSaving: boolean;

  peticions: IPeticion[];

  editForm = this.fb.group({
    id: [],
    proveedor: [],
    servicio: [],
    estado: [],
    coste: [],
    peticion: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected costesService: CostesService,
    protected peticionService: PeticionService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ costes }) => {
      this.updateForm(costes);
    });
    this.peticionService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IPeticion[]>) => mayBeOk.ok),
        map((response: HttpResponse<IPeticion[]>) => response.body)
      )
      .subscribe((res: IPeticion[]) => (this.peticions = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(costes: ICostes) {
    this.editForm.patchValue({
      id: costes.id,
      proveedor: costes.proveedor,
      servicio: costes.servicio,
      estado: costes.estado,
      coste: costes.coste,
      peticion: costes.peticion
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const costes = this.createFromForm();
    if (costes.id !== undefined) {
      this.subscribeToSaveResponse(this.costesService.update(costes));
    } else {
      this.subscribeToSaveResponse(this.costesService.create(costes));
    }
  }

  private createFromForm(): ICostes {
    return {
      ...new Costes(),
      id: this.editForm.get(['id']).value,
      proveedor: this.editForm.get(['proveedor']).value,
      servicio: this.editForm.get(['servicio']).value,
      estado: this.editForm.get(['estado']).value,
      coste: this.editForm.get(['coste']).value,
      peticion: this.editForm.get(['peticion']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICostes>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackPeticionById(index: number, item: IPeticion) {
    return item.id;
  }
}
