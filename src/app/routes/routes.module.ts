import { NgModule } from "@angular/core";

import { SharedModule } from "@shared";
import { UserLockComponent } from "./passport/lock/lock.component";
import { UserLoginComponent } from "./passport/login/login.component";
import { UserRegisterResultComponent } from "./passport/register-result/register-result.component";
import { UserRegisterComponent } from "./passport/register/register.component";
// passport pages
import { EmailVerifyComponent } from "./passport/verify/email-verify.component";
import { RouteRoutingModule } from "./routes-routing.module";
const COMPONENTS = [
  // passport pages
  EmailVerifyComponent,
  UserLoginComponent,
  UserRegisterComponent,
  UserRegisterResultComponent,
  // single pages
  UserLockComponent,
];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, RouteRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class RoutesModule {}
