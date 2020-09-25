import { AfterViewChecked, Component, OnInit } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";
import { _HttpClient } from "@delon/theme";
import {
  ConversationService,
  EchoService,
  askNotificationPermission,
} from "@service";
import { zip } from "rxjs";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.less"],
})
export class ChatComponent implements OnInit {
  assignedData = [];
  unassignedData = [];
  parmaTypes = {
    assigned: {
      type: "assigned",
    },
    unassigned: {
      type: "unassigned",
    },
  };
  channel: String;
  selectId: number = Number(localStorage.getItem("selectId"));
  institutionId: String;
  userId: String;
  constructor(
    private http: _HttpClient,
    private router: Router,
    private conversationSrv: ConversationService,
    private echoSrv: EchoService
  ) {
    router.events.subscribe((evt) => {
      if (evt instanceof NavigationStart) {
        if (evt.url === "/conversation/chat") {
          this.doNav();
        }
      }
    });
  }

  ngOnInit(): void {
    this.getConversationList();
    askNotificationPermission().then(console.log);
  }

  getConversationList(): void {
    zip(
      this.conversationSrv.getVistorList(this.parmaTypes.assigned),
      this.conversationSrv.getVistorList(this.parmaTypes.unassigned)
    ).subscribe(([assignedData, unassignedData]) => {
      this.institutionId = assignedData.data.institution_id;
      this.userId = assignedData.data.user_id;
      this.assignedData = assignedData.data.conversations;
      this.unassignedData = unassignedData.data.conversations;
      this.doNav();

      this.echoSrv.Echo.join(`institution.${this.institutionId}.unassigned`)
        .here(console.log)
        .joining(console.log)
        .leaving(console.log)
        .listen(`.conversation.created`, (e) => {
          this.unassignedData.unshift(e);
          console.log(e, this.unassignedData);
        });

      this.echoSrv.Echo.join(
        `institution.${this.institutionId}.assigned.${this.userId}`
      )
        .here(console.log)
        .joining(console.log)
        .leaving(console.log)
        .listen(`.conversation.created`, (e) => {
          this.assignedData.unshift(e);
          askNotificationPermission().then(() => {
            let body = "";

            const notify = new Notification("新会话接入", {
              body,
              vibrate: 1,
            });

            notify.onclick = () => {
              window.focus();
              this.to(e);

              setTimeout(() => {
                notify.close();
              }, 200);
            };
          });
        })
        .listen(`.message.created`, (e) => {
          askNotificationPermission().then(() => {
            const msg = e;
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
              this.to(e.conversation);

              setTimeout(() => {
                notify.close();
              }, 200);
            };
          });
        });
    });
  }

  doNav(): void {
    if (this.assignedData.length > 0) {
      if (this.selectId) {
        const arr = [...this.assignedData, ...this.unassignedData];
        for (const i of arr) {
          if (i.id === this.selectId) {
            this.navigate(this.selectId);
          }
        }
      } else {
        this.navigate(this.assignedData[0].id);
        localStorage.setItem(
          "selectId",
          JSON.stringify(this.assignedData[0].id)
        );
      }
    } else {
      this.navigate(0);
    }
  }

  to(item: { id: number }): void {
    this.selectId = item.id;
    localStorage.setItem("selectId", JSON.stringify(item.id));
    this.navigate(item.id);
  }

  navigate(id: number): void {
    const url = `/conversation/chat/${id}`;
    this.router.navigateByUrl(url);
  }
}
