import { AfterViewChecked, Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavigationStart, Router } from "@angular/router";
import { _HttpClient } from "@delon/theme";
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
  selectId: number = Number(localStorage.getItem("selectId"));
  institutionId: String;
  userId: String;
  type: string = "online";
  constructor(
    private http: _HttpClient,
    private router: Router,
    private conversationSrv: ConversationService,
    private echoSrv: EchoService
  ) {}

  ngOnInit(): void {
    this.getConversationList();
    this.initCount();
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

  getConversationList(): void {
    zip(this.conversationSrv.getVisitorList({ type: this.type })).subscribe(
      ([visitors]) => {
        console.log(visitors);
        this.institutionId = visitors.data.institution_id;
        this.userId = visitors.data.user_id;
        this.conversations = visitors.data.conversations;

        this.echoSrv.Echo.join(`institution.${this.institutionId}`).listen(
          `.visitors.arrival`,
          (e) => {
            this.conversations.unshift(e);
          }
        );
      }
    );
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
