import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
} from "@angular/core";
import { ActivationEnd, Router } from "@angular/router";
import { DA_SERVICE_TOKEN, ITokenService } from "@delon/auth";
import { _HttpClient } from "@delon/theme";
import { fromEvent, Subscription } from "rxjs";
import { debounceTime, filter } from "rxjs/operators";

@Component({
  selector: "app-account-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.less"],
})
export class ProAccountSettingsComponent implements AfterViewInit, OnDestroy {
  private resize$: Subscription;
  private router$: Subscription;
  mode = "inline";
  title: string;
  menus: Array<{ key: string; title: string; selected?: boolean }> = [
    {
      key: "base",
      title: "基本设置",
    },
    {
      key: "security",
      title: "安全设置",
    },
    {
      key: "binding",
      title: "账号绑定",
    },
    {
      key: "notification",
      title: "新消息通知",
    },
    {
      key: "cache",
      title: "缓存设置",
    },
    {
      key: "logout",
      title: "退出登录",
    },
  ];
  constructor(
    private router: Router,
    private el: ElementRef<HTMLElement>,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
  ) {
    this.router$ = this.router.events
      .pipe(filter((e) => e instanceof ActivationEnd))
      .subscribe(() => this.setActive());
  }

  private setActive(): void {
    const key = this.router.url.substr(this.router.url.lastIndexOf("/") + 1);
    this.menus.forEach((i) => {
      i.selected = i.key === key;
    });
    this.title = this.menus.find((w) => w.selected).title;
  }

  to(item: { key: string }): void {
    if (item.key == "logout") {
      this.tokenService.clear();
      this.router.navigateByUrl(this.tokenService.login_url);
      caches.delete('static');
      return;
    }
    this.router.navigateByUrl(`/pro/account/settings/${item.key}`);
  }

  private resize(): void {
    const el = this.el.nativeElement;
    let mode = "inline";
    const { offsetWidth } = el;
    if (offsetWidth < 641 && offsetWidth > 400) {
      mode = "horizontal";
    }
    if (window.innerWidth < 768 && offsetWidth > 400) {
      mode = "horizontal";
    }
    this.mode = mode;
  }

  ngAfterViewInit(): void {
    this.resize$ = fromEvent(window, "resize")
      .pipe(debounceTime(200))
      .subscribe(() => this.resize());
  }

  ngOnDestroy(): void {
    this.resize$.unsubscribe();
    this.router$.unsubscribe();
  }
}
