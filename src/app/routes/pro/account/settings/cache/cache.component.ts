import { ChangeDetectionStrategy, Component } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd/message";
import { environment } from "@env/environment";

@Component({
  selector: "app-account-settings-cache",
  templateUrl: "./cache.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProAccountSettingsCacheComponent {
  public caches = caches;
  public environment = environment;

  constructor(
    public msg: NzMessageService
  ) {
  }
}
