export interface RespuestaPaginada<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function construirRespuestaPaginada<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): RespuestaPaginada<T> {
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 0,
    },
  };
}
