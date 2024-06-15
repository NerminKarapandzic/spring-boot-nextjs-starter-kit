export interface HttpErrorResponse {
  message: string;
  status: number;
  errors?: Map<string, string>;
  generalErrors?: string[];
}