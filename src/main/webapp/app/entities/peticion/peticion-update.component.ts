import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IPeticion, Peticion } from 'app/shared/model/peticion.model';
import { PeticionService } from './peticion.service';

@Component({
  selector: 'jhi-peticion-update',
  templateUrl: './peticion-update.component.html'
})
export class PeticionUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    codigo: [],
    tipo: [],
    asunto: [],
    descripcion: [],
    estado: [],
    propietario: []
  });

  constructor(protected peticionService: PeticionService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ peticion }) => {
      this.updateForm(peticion);
    });
  }

  updateForm(peticion: IPeticion) {
    this.editForm.patchValue({
      id: peticion.id,
      codigo: peticion.codigo,
      tipo: peticion.tipo,
      asunto: peticion.asunto,
      descripcion: peticion.descripcion,
      estado: peticion.estado,
      propietario: peticion.propietario
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const peticion = this.createFromForm();
    if (peticion.id !== undefined) {
      this.subscribeToSaveResponse(this.peticionService.update(peticion));
    } else {
      this.subscribeToSaveResponse(this.peticionService.create(peticion));
    }
  }

  private createFromForm(): IPeticion {
    return {
      ...new Peticion(),
      id: this.editForm.get(['id']).value,
      codigo: this.editForm.get(['codigo']).value,
      tipo: this.editForm.get(['tipo']).value,
      asunto: this.editForm.get(['asunto']).value,
      descripcion: this.editForm.get(['descripcion']).value,
      estado: this.editForm.get(['estado']).value,
      propietario: this.editForm.get(['propietario']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPeticion>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
