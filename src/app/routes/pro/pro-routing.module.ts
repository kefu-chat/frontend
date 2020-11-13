import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

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

const routes: Routes = [
  {
    path: "profile",
    children: [
      { path: "basic", component: ProProfileBaseComponent },
      { path: "advanced", component: ProProfileAdvancedComponent },
    ],
  },
  {
    path: "account",
    children: [
      {
        path: "center",
        component: ProAccountCenterComponent,
        children: [
          { path: "", redirectTo: "articles", pathMatch: "full" },
          {
            path: "articles",
            component: ProAccountCenterArticlesComponent,
            data: { titleI18n: "pro-account-center" },
          },
          {
            path: "projects",
            component: ProAccountCenterProjectsComponent,
            data: { titleI18n: "pro-account-center" },
          },
          {
            path: "applications",
            component: ProAccountCenterApplicationsComponent,
            data: { titleI18n: "pro-account-center" },
          },
        ],
      },
      {
        path: "settings",
        component: ProAccountSettingsComponent,
        children: [
          { path: "", redirectTo: "base", pathMatch: "full" },
          {
            path: "base",
            component: ProAccountSettingsBaseComponent,
            data: { titleI18n: "pro-account-settings" },
          },
          {
            path: "security",
            component: ProAccountSettingsSecurityComponent,
            data: { titleI18n: "pro-account-settings-security" },
          },
          {
            path: "binding",
            component: ProAccountSettingsBindingComponent,
            data: { titleI18n: "pro-account-settings-binding" },
          },
          {
            path: "notification",
            component: ProAccountSettingsNotificationComponent,
            data: { titleI18n: "pro-account-settings-notification" },
          },
          {
            path: "cache",
            component: ProAccountSettingsCacheComponent,
            data: { titleI18n: "pro-account-settings-cache" },
          },
        ],
      },
    ],
  },
  {
    path: "enterprise",
    children: [
      {
        path: "center",
        component: ProEnterpriseCenterComponent,
        children: [
          { path: "", redirectTo: "articles", pathMatch: "full" },
          {
            path: "articles",
            component: ProEnterpriseCenterArticlesComponent,
            data: { titleI18n: "pro-enterprise-center" },
          },
          {
            path: "projects",
            component: ProEnterpriseCenterProjectsComponent,
            data: { titleI18n: "pro-enterprise-center" },
          },
          {
            path: "applications",
            component: ProEnterpriseCenterApplicationsComponent,
            data: { titleI18n: "pro-enterprise-center" },
          },
        ],
      },
      {
        path: "settings",
        component: ProEnterpriseSettingsComponent,
        children: [
          { path: "", redirectTo: "base", pathMatch: "full" },
          {
            path: "base",
            component: ProEnterpriseSettingsBaseComponent,
            data: { titleI18n: "pro-enterprise-settings" },
          },
          {
            path: "structure",
            component: ProEnterpriseSettingsStructureComponent,
            data: { titleI18n: "pro-enterprise-settings" },
          },
          {
            path: "binding",
            component: ProEnterpriseSettingsBindingComponent,
            data: { titleI18n: "pro-enterprise-settings" },
          },
          {
            path: "notification",
            component: ProEnterpriseSettingsNotificationComponent,
            data: { titleI18n: "pro-enterprise-settings" },
          },
          {
            path: "plan",
            component: ProEnterpriseSettingsPlanComponent,
            data: { title: "套餐管理" },
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProRoutingModule {}
