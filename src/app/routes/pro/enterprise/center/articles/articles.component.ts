import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from "@angular/core";
import { _HttpClient } from "@delon/theme";

@Component({
  selector: "app-enterprise-center-articles",
  templateUrl: "./articles.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProEnterpriseCenterArticlesComponent {
  list: any[];

  constructor(private http: _HttpClient, private cdr: ChangeDetectorRef) {
    this.http.get("/api/list", { count: 8 }).subscribe((res) => {
      this.list = res;
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    });
  }
}
