import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateInmuebleDto {
  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsNumber()
  @IsPositive()
  precio: number;

  @IsInt()
  @Min(0)
  habitaciones: number;

  @IsNumber()
  @IsPositive()
  metrosCuadrados: number;

  @IsUUID()
  tipoInmuebleId: string;
}
