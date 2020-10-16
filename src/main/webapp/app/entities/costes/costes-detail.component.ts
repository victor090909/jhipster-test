import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICostes } from 'app/shared/model/costes.model';

@Component({
  selector: 'jhi-costes-detail',
  templateUrl: './costes-detail.component.html',
})
export class CostesDetailComponent implements OnInit {
  costes: ICostes | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ costes }) => (this.costes = costes));
  }

  previousState(): void {
    window.history.back();
  }
}
