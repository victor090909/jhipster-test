import { IPeticion } from 'app/shared/model/peticion.model';
import { Estado } from 'app/shared/model/enumerations/estado.model';

export interface ICostes {
  id?: number;
  proveedor?: string;
  servicio?: string;
  estado?: Estado;
  coste?: number;
  peticion?: IPeticion;
}

export class Costes implements ICostes {
  constructor(
    public id?: number,
    public proveedor?: string,
    public servicio?: string,
    public estado?: Estado,
    public coste?: number,
    public peticion?: IPeticion
  ) {}
}
