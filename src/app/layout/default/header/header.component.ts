import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Router } from "@angular/router";
import { App, SettingsService, _HttpClient } from "@delon/theme";
import { environment } from "@env/environment";
import {
  Conversation,
  MessageModel,
} from "@model/application/conversation.interface";
import { askNotificationPermission, EchoService } from "@shared/service";
import { zip } from "rxjs";

@Component({
  selector: "layout-header",
  templateUrl: "./header.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  searchToggleStatus: boolean;
  institutionId: string;
  userId: string;
  drawerSidebar = false;

  get app(): App {
    return this.settings.app;
  }

  get collapsed(): boolean {
    return this.settings.layout.collapsed;
  }

  constructor(
    private settings: SettingsService,
    private echoSrv: EchoService,
    private http: _HttpClient,
    private router: Router
  ) {
    this.settings.setLayout("collapsed", true);
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit(): void {
    this.registerWebSocket();
    // this.loadKefuChat();

    const dt = new Date();
    this.registerServiceWorker(
      `/sw.js?_t=` + (dt.getTime() - (dt.getTime() % 600000)) / 100000,
      (subscription: PushSubscriptionJSON) => {
        localStorage.setItem(`can_push`, "yes");
        this.http
          .post(`api/push/subscribe`, { subscription })
          .subscribe(console.log);
      },
      () => {
        localStorage.setItem(`can_push`, "no");
      }
    );
  }

  toggleCollapsedSidebar(): void {
    this.settings.setLayout("collapsed", !this.settings.layout.collapsed);
  }

  searchToggleChange(): void {
    this.searchToggleStatus = !this.searchToggleStatus;
  }

  registerWebSocket(): void {
    zip(this.http.get("api/user", {})).subscribe(([{ data }]) => {
      this.institutionId = data.institution.id;
      this.userId = data.user.id;

      this.echoSrv.Echo.join(`institution.${this.institutionId}`).listen(
        `.conversation.created`,
        (e: Conversation) => {
          askNotificationPermission().then(() => {
            const body = "";

            const notify = new Notification("新会话接入", {
              body,
              vibrate: 1,
            });

            notify.onclick = () => {
              console.log(e);
              this.router.navigateByUrl(`/conversation/chat/${e.id}`);
              window.focus();

              setTimeout(() => {
                notify.close();
              }, 200);
            };
          });
        }
      );

      this.echoSrv.Echo.join(
        `institution.${this.institutionId}.assigned.${this.userId}`
      )
        .listen(`.conversation.created`, (e: Conversation) => {
          askNotificationPermission().then(() => {
            const body = "";

            const notify = new Notification("新会话接入", {
              body,
              vibrate: 1,
            });

            notify.onclick = () => {
              window.focus();

              setTimeout(() => {
                this.router.navigateByUrl(`/conversation/chat/${e.id}`);
                notify.close();
              }, 200);
            };
          });
        })
        .listen(`.message.created`, (msg: MessageModel) => {
          if (msg.sender_type_text == "user") {
            return;
          }
          askNotificationPermission().then(() => {
            let body: string;
            let image: string;

            if (msg.type == 1) {
              body = msg.content;
            }
            if (msg.type == 2) {
              body = "[图片消息]";
              image = msg.content;
            }

            const notify = new Notification("您收到新消息", {
              body,
              image,
              vibrate: 1,
            });

            notify.onclick = () => {
              window.focus();

              setTimeout(() => {
                this.router.navigateByUrl(
                  `/conversation/chat/${msg.conversation_id}`
                );
                notify.close();
              }, 200);
            };
          });
        });
    });
  }

  drawerSidebarClose(): void {
    this.drawerSidebar = false;
  }

  drawerSidebarToggle(): void {
    this.drawerSidebar = !this.drawerSidebar;
  }
  
  registerServiceWorker(js: string, onSuccess: (json: PushSubscriptionJSON) => void, onError: () => void): void {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register(js)
      .then((swRegistration: ServiceWorkerRegistration) => {
        swRegistration.addEventListener(`updatefound`, () => {
          const newWorker = swRegistration.installing;
          if (newWorker.state === `redundant`) {
            caches.open(`static`).then((cache) => {
              cache.keys().then(requests => requests.forEach((request) => {
                cache.match(request).then(response => {
                  if ((response.headers.get(`content-type`) || response.headers.get(`Content-Type`)).indexOf('text/html') === 0) {
                    if ((new Date(response.headers.get(`date`) || response.headers.get(`Date`))).getTime() - (new Date).getTime() > 1000 * 60 * 10) {
                      cache.delete(request);
                    }
                  }
                });
              }));
            });
          }
        });

        const onSubscribed = (subscription: PushSubscription) => {
          console.log('User is subscribed.', subscription);
          onSuccess(subscription.toJSON());
        };

        const doSubscribe = () => {
          swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: environment.notificationKey,
          })
          .then(onSubscribed)
          .catch((err) => {
            onError();
            console.error('Failed to subscribe the user: ', err);
          });
        };

        swRegistration.pushManager.getSubscription().then((subscription: null | PushSubscription) => {
          if (!subscription) {
            doSubscribe();
            return;
          }
          onSubscribed(subscription);
        }, doSubscribe);
      })
      .catch((error: {}) => {
        onError();
        console.error('Service Worker Error', error);
      });
    } else {
      onError();
      console.warn('Push messaging is not supported');
    }
  }

  loadKefuChat(): void {
    ((d, e, f, institution_id) => {
      (window as any)[f] = () => {
        return {
          institution_id,
          unique_id: this.settings.user.id,
          name: this.settings.user.name,
          phone: this.settings.user.phone,
          email: this.settings.user.email,
        };
      };

      const js = (d.createElement(e) as HTMLScriptElement);
      js.src = 'https://kfwidget.ssls.com.cn/widget.js';
      js.async = true;
      js.defer = true;
      d.head.appendChild(js);
    })(document, 'script', '_kefuchat_init', 'DdKle6Ikkg2Nq12w');
  }
}
