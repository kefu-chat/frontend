import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { User } from "@model/application/conversation.interface";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzUploadChangeParam } from "ng-zorro-antd/upload";
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

  cities: ProAccountSettingsCity[] = [];

  ngOnInit(): void {
    zip(this.http.get(`api/user`)).subscribe(([param1]: [any]) => {
      const user: User = param1.data.user;
      this.userLoading = false;
      this.user = user;
      this.cdr.detectChanges();
    });
  }

  // #endregion

  save(): boolean {
    this.http.patch(`api/settings/profile`, this.user).subscribe((param1) => {
      const user: User = param1.data.user;
      this.userLoading = false;
      this.user = user;

      this.msg.success("Success!");
    });
    return false;
  }

  changeAvatar(evt: NzUploadChangeParam): void {
    if ("success" != evt.type) {
      console.log(evt.type);
      return;
    }

    this.user.avatar =
      evt.file.response.data.url +
      "?x-oss-process=image/resize,m_mfit,w_500,h_500,limit_0/crop,h_500,w_500,r_250,g_center";
  }
}
