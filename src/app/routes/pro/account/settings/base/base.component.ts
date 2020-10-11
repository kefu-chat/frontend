import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { User } from "@model/application/conversation.interface";
import { NzMessageService } from "ng-zorro-antd/message";
import { zip } from "rxjs";

interface ProAccountSettingsCity {
  name: string;
  id: string;
}

@Component({
  selector: "app-account-settings-base",
  templateUrl: "./base.component.html",
  styleUrls: ["./base.component.less"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProAccountSettingsBaseComponent implements OnInit {
  constructor(
    private http: _HttpClient,
    private cdr: ChangeDetectorRef,
    private msg: NzMessageService
  ) {}
  avatar = "";
  userLoading = true;
  user: User;

  // #region geo

  provinces: ProAccountSettingsCity[] = [];
  cities: ProAccountSettingsCity[] = [];

  ngOnInit(): void {
    zip(this.http.get(`api/user`), this.http.get("/geo/province")).subscribe(
      ([param1, province]: [any, ProAccountSettingsCity[]]) => {
        const user: User = param1.data.user;
        this.userLoading = false;
        this.user = user;
        this.cdr.detectChanges();
      }
    );
  }

  // #endregion

  save(): boolean {
    this.http.patch(`api/settings/profile`, this.user).subscribe((param1) => {
      const user: User = param1.data.user;
      this.userLoading = false;
      this.user = user;
    });
    return false;
  }
}
