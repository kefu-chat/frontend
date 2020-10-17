import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Router } from "@angular/router";
import { App, SettingsService, _HttpClient } from "@delon/theme";
import { askNotificationPermission, EchoService } from "@shared/service";
import { environment } from "@env/environment";
import { zip } from "rxjs";

@Component({
  selector: "layout-header",
  templateUrl: "./header.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  searchToggleStatus: boolean;
  institutionId: String;
  userId: String;

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

  ngOnInit(): void {
    this.registerServiceWorker('/assets/sw.js', (subscription: PushSubscriptionJSON) => {
      localStorage.setItem(`can_push`, 'yes');

      this.http.post(`api/push/subscribe`, {subscription}).subscribe(console.log);
    }, () => {
      localStorage.setItem(`can_push`, 'no');
      zip(this.http.get("api/user", {})).subscribe(([{ data }]) => {
        this.institutionId = data.institution.id;
        this.userId = data.user.id;

        this.echoSrv.Echo.join(`institution.${this.institutionId}`).listen(
          `.conversation.created`,
          (e) => {
            askNotificationPermission().then(() => {
              let body = "";

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
          .listen(`.conversation.created`, (e) => {
            askNotificationPermission().then(() => {
              let body = "";

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
          .listen(`.message.created`, (msg) => {
            if (msg.sender_type_text == "user") {
              return;
            }
            askNotificationPermission().then(() => {
              let body, image;

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
    });
  }

  toggleCollapsedSidebar(): void {
    this.settings.setLayout("collapsed", !this.settings.layout.collapsed);
  }

  searchToggleChange(): void {
    this.searchToggleStatus = !this.searchToggleStatus;
  }

  registerServiceWorker(js: string, onSuccess: (json: PushSubscriptionJSON) => void, onError: () => void): void {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register(js)
      .then((swRegistration: ServiceWorkerRegistration) => {
        console.log('Service Worker is registered', swRegistration);

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
      .catch(function(error) {
        onError();
        console.error('Service Worker Error', error);
      });
    } else {
      onError();
      console.warn('Push messaging is not supported');
    }
  }
}
