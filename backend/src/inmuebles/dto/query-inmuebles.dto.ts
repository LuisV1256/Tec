import { Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { ESTADOS_INMUEBLE } from '../estados-inmueble.constants';

export class QueryInmueblesDto {
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit: number = 10;

  @IsOptional()
  @IsIn(ESTADOS_INMUEBLE)
  estado?: string;

  @IsOptional()
  @IsUUID()
  tipoInmuebleId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  precioMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  precioMax?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  soloMios?: boolean;

  @IsOptional()
  @IsIn(['precio', 'createdAt'])
  orderBy: 'precio' | 'createdAt' = 'createdAt';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order: 'ASC' | 'DESC' = 'DESC';
}
