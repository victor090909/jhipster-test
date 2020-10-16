import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { ICostes, Costes } from 'app/shared/model/costes.model';
import { CostesService } from './costes.service';
import { IPeticion } from 'app/shared/model/peticion.model';
import { PeticionService } from 'app/entities/peticion/peticion.service';

@Component({
  selector: 'jhi-costes-update',
  templateUrl: './costes-update.component.html',
})
export class CostesUpdateComponent implements OnInit {
  isSaving = false;
  peticions: IPeticion[] = [];

  editForm = this.fb.group({
    id: [],
    proveedor: [],
    servicio: [],
    estado: [],
    coste: [],
    peticion: [],
  });

  constructor(
    protected costesService: CostesService,
    protected peticionService: PeticionService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ costes }) => {
      this.updateForm(costes);

      this.peticionService.query().subscribe((res: HttpResponse<IPeticion[]>) => (this.peticions = res.body || []));
    });
  }

  updateForm(costes: ICostes): void {
    this.editForm.patchValue({
      id: costes.id,
      proveedor: costes.proveedor,
      servicio: costes.servicio,
      estado: costes.estado,
      coste: costes.coste,
      peticion: costes.peticion,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
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
      id: this.editForm.get(['id'])!.value,
      proveedor: this.editForm.get(['proveedor'])!.value,
      servicio: this.editForm.get(['servicio'])!.value,
      estado: this.editForm.get(['estado'])!.value,
      coste: this.editForm.get(['coste'])!.value,
      peticion: this.editForm.get(['peticion'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICostes>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: IPeticion): any {
    return item.id;
  }
}
