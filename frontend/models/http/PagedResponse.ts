export interface PagedResponse<T> {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  data: T[];
}