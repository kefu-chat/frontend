import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-enterprise-settings-notification",
  templateUrl: "./notification.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProEnterpriseSettingsNotificationComponent {
  i: {
    password: boolean;
    messages: boolean;
    todo: boolean;
  } = {
    password: true,
    messages: true,
    todo: true,
  };
}
