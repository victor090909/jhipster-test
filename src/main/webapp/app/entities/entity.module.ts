import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'peticion',
        loadChildren: () => import('./peticion/peticion.module').then(m => m.JhipsterTestPeticionModule)
      },
      {
        path: 'costes',
        loadChildren: () => import('./costes/costes.module').then(m => m.JhipsterTestCostesModule)
      },
      {
        path: 'tareas',
        loadChildren: () => import('./tareas/tareas.module').then(m => m.JhipsterTestTareasModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ]
})
export class JhipsterTestEntityModule {}
