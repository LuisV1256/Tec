import { IsIn } from 'class-validator';
import { ESTADOS_INMUEBLE } from '../estados-inmueble.constants';

export class CambiarEstadoDto {
  @IsIn(ESTADOS_INMUEBLE)
  estadoCodigo: string;
}
