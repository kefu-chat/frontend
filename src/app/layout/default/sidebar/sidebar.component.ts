import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SettingsService, User as SystemUser } from '@delon/theme';
import { User } from "@model/application/conversation.interface";

@Component({
  selector: 'layout-sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  get user(): SystemUser | User {
    return this.settings.user;
  }

  constructor(private settings: SettingsService) {}
}
