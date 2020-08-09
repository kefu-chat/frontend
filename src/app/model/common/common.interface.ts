import { Data } from "@angular/router";

export interface Res<T> {
  success: boolean;
  data: T;
  message?: string;
}
