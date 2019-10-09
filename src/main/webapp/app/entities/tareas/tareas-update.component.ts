import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { ITareas, Tareas } from 'app/shared/model/tareas.model';
import { TareasService } from './tareas.service';
import { IPeticion } from 'app/shared/model/peticion.model';
import { PeticionService } from 'app/entities/peticion/peticion.service';

@Component({
  selector: 'jhi-tareas-update',
  templateUrl: './tareas-update.component.html'
})
export class TareasUpdateComponent implements OnInit {
  isSaving: boolean;

  peticions: IPeticion[];

  editForm = this.fb.group({
    id: [],
    responsable: [],
    titulo: [],
    descripcion: [],
    estado: [],
    fechafin: [],
    peticion: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected tareasService: TareasService,
    protected peticionService: PeticionService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ tareas }) => {
      this.updateForm(tareas);
    });
    this.peticionService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IPeticion[]>) => mayBeOk.ok),
        map((response: HttpResponse<IPeticion[]>) => response.body)
      )
      .subscribe((res: IPeticion[]) => (this.peticions = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(tareas: ITareas) {
    this.editForm.patchValue({
      id: tareas.id,
      responsable: tareas.responsable,
      titulo: tareas.titulo,
      descripcion: tareas.descripcion,
      estado: tareas.estado,
      fechafin: tareas.fechafin != null ? tareas.fechafin.format(DATE_TIME_FORMAT) : null,
      peticion: tareas.peticion
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
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
      id: this.editForm.get(['id']).value,
      responsable: this.editForm.get(['responsable']).value,
      titulo: this.editForm.get(['titulo']).value,
      descripcion: this.editForm.get(['descripcion']).value,
      estado: this.editForm.get(['estado']).value,
      fechafin: this.editForm.get(['fechafin']).value != null ? moment(this.editForm.get(['fechafin']).value, DATE_TIME_FORMAT) : undefined,
      peticion: this.editForm.get(['peticion']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITareas>>) {
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
