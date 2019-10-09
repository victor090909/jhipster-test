import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPeticion } from 'app/shared/model/peticion.model';

@Component({
  selector: 'jhi-peticion-detail',
  templateUrl: './peticion-detail.component.html'
})
export class PeticionDetailComponent implements OnInit {
  peticion: IPeticion;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ peticion }) => {
      this.peticion = peticion;
    });
  }

  previousState() {
    window.history.back();
  }
}
