import { Moment } from 'moment';
import { IPeticion } from 'app/shared/model/peticion.model';
import { Estado } from 'app/shared/model/enumerations/estado.model';

export interface ITareas {
  id?: number;
  responsable?: string;
  titulo?: string;
  descripcion?: string;
  estado?: Estado;
  fechafin?: Moment;
  peticion?: IPeticion;
}

export class Tareas implements ITareas {
  constructor(
    public id?: number,
    public responsable?: string,
    public titulo?: string,
    public descripcion?: string,
    public estado?: Estado,
    public fechafin?: Moment,
    public peticion?: IPeticion
  ) {}
}
