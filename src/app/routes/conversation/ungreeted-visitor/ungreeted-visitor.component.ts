import { AfterViewChecked, Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavigationStart, Router } from "@angular/router";
import { SettingsService, User, _HttpClient } from "@delon/theme";
import {
  ConversationService,
  EchoService,
  askNotificationPermission,
} from "@service";
import { zip } from "rxjs";
import { Conversation } from "@model/application/conversation.interface";

@Component({
  selector: "app-chat",
  templateUrl: "./ungreeted-visitor.component.html",
  styleUrls: ["./../chat/chat.component.less"],
})
export class UngreetedVisitorComponent implements OnInit {
  conversations: Conversation[] = [];
  conversationsCount: Number = 0;
  channel: String;
  selectId: String;
  institutionId: String;
  userId: String;
  type: string = "online";

  get user(): User {
    return this.settings.user;
  }

  constructor(
    private http: _HttpClient,
    private router: Router,
    private conversationSrv: ConversationService,
    private echoSrv: EchoService,
    private settings: SettingsService
  ) {
    router.events.subscribe((evt) => {
      if (evt instanceof NavigationStart) {
        if (evt.url === "/conversation/visitor") {
          this.selectId = "";
        } else if (evt.url.indexOf("/conversation/visitor/") == 0) {
          this.selectId = evt.url.split("/conversation/visitor/")[1];
        }
      }
    });
  }

  ngOnInit(): void {
    this.initCount();
    this.initVisitorList();
    askNotificationPermission().then(console.log);
  }

  initCount(): void {
    this.http
      .get("api/conversation/count")
      .subscribe(({ data: { online_visitor_count } }) => {
        this.conversationsCount = online_visitor_count;
      });

    // @TODO: 新会话进来的 socket, 更新统计数字.
    // @TODO: 接待回复后, 从 this.unassignedCount 更新到 this.assignedCount
    // @TODO: 关闭会话后, this.assignedCount --
  }

  initVisitorList(): void {
    zip(this.conversationSrv.getVisitorList({ type: this.type })).subscribe(
      ([visitors]) => {
        console.log(visitors);
        this.institutionId = visitors.data.institution_id;
        this.userId = visitors.data.user_id;
        this.conversations = visitors.data.conversations;

        this.echoSrv.Echo.join(`institution.${this.institutionId}`).listen(
          `.visitor.arrival`,
          (e) => {
            this.conversations.unshift(e);
          }
        );
      }
    );
  }

  to(item: { id: any }): void {
    this.selectId = item.id;
    this.navigate(item.id);
  }

  navigate(id: any): void {
    const url = `/conversation/visitor/${id}`;
    this.router.navigateByUrl(url);
  }
}
