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
import { ProAccountSettingsCacheComponent } from "./account/settings/cache/cache.component";
import { ProAccountSettingsComponent } from "./account/settings/settings.component";
import { ProEnterpriseCenterApplicationsComponent } from "./enterprise/center/applications/applications.component";
import { ProEnterpriseCenterArticlesComponent } from "./enterprise/center/articles/articles.component";
import { ProEnterpriseCenterComponent } from "./enterprise/center/center.component";
import { ProEnterpriseCenterProjectsComponent } from "./enterprise/center/projects/projects.component";
import { ProEnterpriseSettingsBaseComponent } from "./enterprise/settings/base/base.component";
import { ProEnterpriseSettingsBindingComponent } from "./enterprise/settings/binding/binding.component";
import { ProEnterpriseSettingsNotificationComponent } from "./enterprise/settings/notification/notification.component";
import { ProEnterpriseSettingsPlanComponent } from "./enterprise/settings/plan/plan.component";
import { ProEnterpriseSettingsComponent } from "./enterprise/settings/settings.component";
import { ProEnterpriseSettingsStructureComponent } from "./enterprise/settings/structure/structure.component";
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
  ProAccountSettingsCacheComponent,
  ProAccountSettingsBindingComponent,
  ProAccountSettingsNotificationComponent,
  ProEnterpriseCenterComponent,
  ProEnterpriseCenterArticlesComponent,
  ProEnterpriseCenterProjectsComponent,
  ProEnterpriseCenterApplicationsComponent,
  ProEnterpriseSettingsComponent,
  ProEnterpriseSettingsBaseComponent,
  ProEnterpriseSettingsStructureComponent,
  ProEnterpriseSettingsBindingComponent,
  ProEnterpriseSettingsNotificationComponent,
  ProEnterpriseSettingsPlanComponent,
];

const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, ProRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class ProModule {}
