import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITareas } from 'app/shared/model/tareas.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { TareasService } from './tareas.service';
import { TareasDeleteDialogComponent } from './tareas-delete-dialog.component';

@Component({
  selector: 'jhi-tareas',
  templateUrl: './tareas.component.html',
})
export class TareasComponent implements OnInit, OnDestroy {
  tareas: ITareas[];
  eventSubscriber?: Subscription;
  itemsPerPage: number;
  links: any;
  page: number;
  predicate: string;
  ascending: boolean;
  currentSearch: string;

  constructor(
    protected tareasService: TareasService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parseLinks: JhiParseLinks,
    protected activatedRoute: ActivatedRoute
  ) {
    this.tareas = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParams['search']
        ? this.activatedRoute.snapshot.queryParams['search']
        : '';
  }

  loadAll(): void {
    if (this.currentSearch) {
      this.tareasService
        .search({
          query: this.currentSearch,
          page: this.page,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe((res: HttpResponse<ITareas[]>) => this.paginateTareas(res.body, res.headers));
      return;
    }

    this.tareasService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe((res: HttpResponse<ITareas[]>) => this.paginateTareas(res.body, res.headers));
  }

  reset(): void {
    this.page = 0;
    this.tareas = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  search(query: string): void {
    this.tareas = [];
    this.links = {
      last: 0,
    };
    this.page = 0;
    if (query) {
      this.predicate = '_score';
      this.ascending = false;
    } else {
      this.predicate = 'id';
      this.ascending = true;
    }
    this.currentSearch = query;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInTareas();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: ITareas): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInTareas(): void {
    this.eventSubscriber = this.eventManager.subscribe('tareasListModification', () => this.reset());
  }

  delete(tareas: ITareas): void {
    const modalRef = this.modalService.open(TareasDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.tareas = tareas;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateTareas(data: ITareas[] | null, headers: HttpHeaders): void {
    const headersLink = headers.get('link');
    this.links = this.parseLinks.parse(headersLink ? headersLink : '');
    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.tareas.push(data[i]);
      }
    }
  }
}
