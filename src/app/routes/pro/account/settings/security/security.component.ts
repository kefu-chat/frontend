import { ChangeDetectionStrategy, Component } from "@angular/core";
import { SettingsService, User as SystemUser, _HttpClient } from "@delon/theme";
import { User } from '@model/application/conversation.interface';
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
  selector: "app-account-settings-security",
  templateUrl: "./security.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProAccountSettingsSecurityComponent {
  constructor(
    public msg: NzMessageService,
    private settings: SettingsService
  ) {}

  get user(): SystemUser | User {
    return this.settings.user;
  }
}
