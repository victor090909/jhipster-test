import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPeticion } from 'app/shared/model/peticion.model';

@Component({
  selector: 'jhi-peticion-detail',
  templateUrl: './peticion-detail.component.html',
})
export class PeticionDetailComponent implements OnInit {
  peticion: IPeticion | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ peticion }) => (this.peticion = peticion));
  }

  previousState(): void {
    window.history.back();
  }
}
