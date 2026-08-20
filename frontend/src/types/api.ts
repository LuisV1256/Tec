export interface RespuestaPaginada<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiErrorBody {
  statusCode: number;
  code: string;
  message: string;
  path: string;
}

export class ApiError extends Error {
  statusCode: number;
  code: string;

  constructor(body: ApiErrorBody) {
    super(body.message);
    this.statusCode = body.statusCode;
    this.code = body.code;
  }
}
