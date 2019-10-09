import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITareas } from 'app/shared/model/tareas.model';

@Component({
  selector: 'jhi-tareas-detail',
  templateUrl: './tareas-detail.component.html'
})
export class TareasDetailComponent implements OnInit {
  tareas: ITareas;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ tareas }) => {
      this.tareas = tareas;
    });
  }

  previousState() {
    window.history.back();
  }
}
