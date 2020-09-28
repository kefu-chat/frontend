import { AfterViewChecked, Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationStart, Router } from "@angular/router";
import { SettingsService, User, _HttpClient } from "@delon/theme";
import { Conversation } from "@model/application/conversation.interface";
import { NzBadgeModule } from "ng-zorro-antd/badge";
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
  selectId: any = null;
  institutionId: String;
  userId: String;
  currentTab: Number;

  get user(): User {
    return this.settings.user;
  }

  constructor(
    private http: _HttpClient,
    private router: Router,
    private conversationSrv: ConversationService,
    private echoSrv: EchoService,
    private route: ActivatedRoute,
    private settings: SettingsService
  ) {
    router.events.subscribe((evt) => {
      if (evt instanceof NavigationStart) {
        if (evt.url === "/conversation/chat") {
          this.selectId = 0;
          this.doNav();
        } else if (evt.url.indexOf("/conversation/chat/") == 0) {
          try {
            this.selectId = evt.url.split("/conversation/chat/")[1];
          } catch (e) {
            console.error(e);
          }
        }
      }
    });
  }

  ngOnInit(): void {
    this.getConversationList();
    askNotificationPermission().then(console.log);

    try {
      this.selectId = (this.route.children[0].params as any).getValue().id;
    } catch (e) {}
  }

  getConversationList(): void {
    zip(
      this.conversationSrv.getConversationList(this.parmaTypes.assigned),
      this.conversationSrv.getConversationList(this.parmaTypes.unassigned)
    ).subscribe(([assignedData, unassignedData]) => {
      this.institutionId = assignedData.data.institution_id;
      this.userId = assignedData.data.user_id;
      this.assignedData = assignedData.data.conversations;
      this.unassignedData = unassignedData.data.conversations;
      this.doNav();

      if (
        this.assignedData.filter(
          (conversation: Conversation) => conversation.id == this.selectId
        ).length
      ) {
        this.currentTab = 2;
      }

      this.echoSrv.Echo.join(`institution.${this.institutionId}`).listen(
        `.conversation.created`,
        (e) => {
          this.unassignedData.unshift(e);
        }
      );

      this.echoSrv.Echo.join(
        `institution.${this.institutionId}.assigned.${this.userId}`
      ).listen(`.conversation.created`, (e) => {
        this.assignedData.unshift(e);
      });
    });
  }

  doNav(): void {
    if (this.assignedData.length > 0) {
      return; //不要自动选择
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
      this.selectId = 0;
      //this.navigate(0);
    }
  }

  to(item: { id: any }): void {
    this.selectId = item.id;
    localStorage.setItem("selectId", JSON.stringify(item.id));
    this.navigate(item.id);
  }

  navigate(id: any): void {
    const url = `/conversation/chat/${id}`;
    this.router.navigateByUrl(url);
  }
}
