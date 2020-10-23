import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SimpleGuard } from "@delon/auth";
import { environment } from "@env/environment";
// layout
import { LayoutDefaultComponent } from "../layout/default/default.component";
import { LayoutFullScreenComponent } from "../layout/fullscreen/fullscreen.component";
import { LayoutPassportComponent } from "../layout/passport/passport.component";
import { UserLoginComponent } from "./passport/login/login.component";
import { UserRegisterResultComponent } from "./passport/register-result/register-result.component";
import { UserRegisterComponent } from "./passport/register/register.component";
import { EmailVerifyComponent } from "./passport/verify/email-verify.component";

const routes: Routes = [
  {
    path: "",
    component: LayoutDefaultComponent,
    canActivate: [SimpleGuard],
    canActivateChild: [SimpleGuard],
    children: [
      { path: "", redirectTo: "conversation/chat", pathMatch: "full" },
      {
        path: "conversation",
        redirectTo: "conversation/chat",
        pathMatch: "full",
      },
      // conversation
      {
        path: "conversation",
        loadChildren: () =>
          import("./conversation/conversation.module").then(
            (m) => m.ConversationModule
          ),
      },
      // 机器人
      {
        path: "",
        loadChildren: () =>
          import("./bot/bot.module").then(
            (m) => m.BotModule
          ),
      },
      // Settings
      {
        path: "pro",
        loadChildren: () => import("./pro/pro.module").then((m) => m.ProModule),
      },
      // Exception
      {
        path: "exception",
        loadChildren: () =>
          import("./exception/exception.module").then((m) => m.ExceptionModule),
      },
    ],
  },
  // passport
  {
    path: "",
    component: LayoutPassportComponent,
    children: [
      {
        path: "login",
        component: UserLoginComponent,
        data: { title: "登录", titleI18n: "app.login.login" },
      },
      {
        path: "register",
        component: UserRegisterComponent,
        data: { title: "注册", titleI18n: "app.register.register" },
      },
      {
        path: "register-result",
        component: UserRegisterResultComponent,
        data: { title: "注册结果", titleI18n: "app.register.register" },
      },
      {
        path: "email/verify/:id",
        component: EmailVerifyComponent,
        data: { title: "邮件验证", titleI18n: "app.email.verify" },
      },
      // {
      //   path: "email/resend",
      //   component: EmailResendComponent,
      //   data: { title: "重发邮件验证", titleI18n: "app.email.verify.resend" },
      // },
      {
        path: "lock",
        component: UserLoginComponent,
        data: { title: "锁屏", titleI18n: "app.lock" },
      },
    ],
  },
  // 单页不包裹Layout
  { path: "**", redirectTo: "exception/404" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: environment.useHash,
      // NOTICE: If you use `reuse-tab` component and turn on keepingScroll you can set to `disabled`
      // Pls refer to https://ng-alain.com/components/reuse-tab
      scrollPositionRestoration: "top",
    }),
  ],
  exports: [RouterModule],
})
export class RouteRoutingModule {}
