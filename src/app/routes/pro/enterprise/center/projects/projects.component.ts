import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
  selector: "app-enterprise-center-projects",
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.less"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProEnterpriseCenterProjectsComponent {
  listLoading = true;
  list: any[] = [];

  constructor(
    private http: _HttpClient,
    private msg: NzMessageService,
    private cdr: ChangeDetectorRef
  ) {
    this.http.get("/api/list", { count: 8 }).subscribe((res) => {
      this.list = res;
      this.listLoading = false;
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    });
  }

  suc(id: number): void {
    this.msg.success(`标题：${id}`);
  }
}
