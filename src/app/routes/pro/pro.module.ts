import { NgModule } from "@angular/core";

import { SharedModule } from "@shared";
import { ProRoutingModule } from "./pro-routing.module";

import { ProAccountCenterApplicationsComponent } from "./account/center/applications/applications.component";
import { ProAccountCenterArticlesComponent } from "./account/center/articles/articles.component";
import { ProAccountCenterComponent } from "./account/center/center.component";
import { ProAccountCenterProjectsComponent } from "./account/center/projects/projects.component";
import { ProAccountSettingsBaseComponent } from "./account/settings/base/base.component";
import { ProAccountSettingsBindingComponent } from "./account/settings/binding/binding.component";
import { ProAccountSettingsNotificationComponent } from "./account/settings/notification/notification.component";
import { ProAccountSettingsSecurityComponent } from "./account/settings/security/security.component";
import { ProAccountSettingsComponent } from "./account/settings/settings.component";
import { ProProfileAdvancedComponent } from "./profile/advanced/advanced.component";
import { ProProfileBaseComponent } from "./profile/basic/basic.component";

const COMPONENTS = [
  ProProfileBaseComponent,
  ProProfileAdvancedComponent,
  ProAccountCenterComponent,
  ProAccountCenterArticlesComponent,
  ProAccountCenterProjectsComponent,
  ProAccountCenterApplicationsComponent,
  ProAccountSettingsComponent,
  ProAccountSettingsBaseComponent,
  ProAccountSettingsSecurityComponent,
  ProAccountSettingsBindingComponent,
  ProAccountSettingsNotificationComponent,
];

const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, ProRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class ProModule {}
