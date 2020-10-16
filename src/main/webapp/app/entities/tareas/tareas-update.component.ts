import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { ITareas, Tareas } from 'app/shared/model/tareas.model';
import { TareasService } from './tareas.service';
import { IPeticion } from 'app/shared/model/peticion.model';
import { PeticionService } from 'app/entities/peticion/peticion.service';

@Component({
  selector: 'jhi-tareas-update',
  templateUrl: './tareas-update.component.html',
})
export class TareasUpdateComponent implements OnInit {
  isSaving = false;
  peticions: IPeticion[] = [];

  editForm = this.fb.group({
    id: [],
    responsable: [],
    titulo: [],
    descripcion: [],
    estado: [],
    fechafin: [],
    peticion: [],
  });

  constructor(
    protected tareasService: TareasService,
    protected peticionService: PeticionService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tareas }) => {
      if (!tareas.id) {
        const today = moment().startOf('day');
        tareas.fechafin = today;
      }

      this.updateForm(tareas);

      this.peticionService.query().subscribe((res: HttpResponse<IPeticion[]>) => (this.peticions = res.body || []));
    });
  }

  updateForm(tareas: ITareas): void {
    this.editForm.patchValue({
      id: tareas.id,
      responsable: tareas.responsable,
      titulo: tareas.titulo,
      descripcion: tareas.descripcion,
      estado: tareas.estado,
      fechafin: tareas.fechafin ? tareas.fechafin.format(DATE_TIME_FORMAT) : null,
      peticion: tareas.peticion,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tareas = this.createFromForm();
    if (tareas.id !== undefined) {
      this.subscribeToSaveResponse(this.tareasService.update(tareas));
    } else {
      this.subscribeToSaveResponse(this.tareasService.create(tareas));
    }
  }

  private createFromForm(): ITareas {
    return {
      ...new Tareas(),
      id: this.editForm.get(['id'])!.value,
      responsable: this.editForm.get(['responsable'])!.value,
      titulo: this.editForm.get(['titulo'])!.value,
      descripcion: this.editForm.get(['descripcion'])!.value,
      estado: this.editForm.get(['estado'])!.value,
      fechafin: this.editForm.get(['fechafin'])!.value ? moment(this.editForm.get(['fechafin'])!.value, DATE_TIME_FORMAT) : undefined,
      peticion: this.editForm.get(['peticion'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITareas>>): void {
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
