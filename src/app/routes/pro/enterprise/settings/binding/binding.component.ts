import { ChangeDetectionStrategy, Component } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
  selector: "app-enterprise-settings-binding",
  templateUrl: "./binding.component.html",
})
export class ProEnterpriseSettingsBindingComponent {
  constructor(public msg: NzMessageService) {}
}
