import { ChangeDetectionStrategy, Component } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
  selector: "app-enterprise-settings-security",
  templateUrl: "./security.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProEnterpriseSettingsSecurityComponent {
  constructor(public msg: NzMessageService) {}
}
