import { ICostes } from 'app/shared/model/costes.model';
import { ITareas } from 'app/shared/model/tareas.model';
import { Tipo } from 'app/shared/model/enumerations/tipo.model';
import { Estado } from 'app/shared/model/enumerations/estado.model';

export interface IPeticion {
  id?: number;
  codigo?: string;
  tipo?: Tipo;
  asunto?: string;
  descripcion?: string;
  estado?: Estado;
  propietario?: string;
  costes?: ICostes[];
  tareas?: ITareas[];
}

export class Peticion implements IPeticion {
  constructor(
    public id?: number,
    public codigo?: string,
    public tipo?: Tipo,
    public asunto?: string,
    public descripcion?: string,
    public estado?: Estado,
    public propietario?: string,
    public costes?: ICostes[],
    public tareas?: ITareas[]
  ) {}
}
