import { HttpStatus } from '@nestjs/common';

export interface PaginationMeta {
  itemCount: number;
  itemsPerPage: number;
  lastPage: number;
  currentPage: number;
  nextPage: number;
  prevPage: number;
}

export class BaseResponse<T> {
  constructor(
    public data: T,
    public pagination?: PaginationMeta,
    public message: string = 'Success',
    public statusCode: number = HttpStatus.OK,
  ) { }
}