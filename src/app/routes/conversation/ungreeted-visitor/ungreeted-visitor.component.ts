import { CommonModule } from "@angular/common";
import { AfterViewChecked, Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationStart, Router } from "@angular/router";
import { SettingsService, User, _HttpClient } from "@delon/theme";
import { Conversation } from "@model/application/conversation.interface";
import {
  askNotificationPermission,
  ConversationService,
  EchoService,
} from "@service";
import { zip } from "rxjs";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { NzI18nService } from "ng-zorro-antd/i18n";

@Component({
  selector: "app-chat",
  templateUrl: "./ungreeted-visitor.component.html",
  styleUrls: ["./ungreeted-visitor.component.less"],
})
export class UngreetedVisitorComponent implements OnInit {
  conversations: Conversation[] = [];
  conversationsCount = 0;
  channel: string;
  selectId: string;
  institutionId: string;
  userId: string;
  currentTab: number;
  keyword = "";
  type = "online";

  get user(): User {
    return this.settings.user;
  }

  constructor(
    private http: _HttpClient,
    private router: Router,
    private conversationSrv: ConversationService,
    private echoSrv: EchoService,
    private settings: SettingsService,
    private route: ActivatedRoute,
    private nzI18n: NzI18nService
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

    if (!this.route.children.length) {
      return;
    }
    this.selectId = (this.route.children[0].params as any).getValue().id;
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

  toSee(item: { id: any }): void {
    this.selectId = item.id;
    const url = `/conversation/visitor/${item.id}`;
    this.router.navigateByUrl(url);
  }

  toChat(item: { id: any }): void {
    this.selectId = item.id;
    const url = `/conversation/chat/${item.id}`;
    this.router.navigateByUrl(url);
  }

  navigate(id: any): void {}

  fromNow(timeTz: Date | string) {
    return (
      formatDistanceToNow(new Date(timeTz), {
        locale: this.nzI18n.getDateLocale(),
      }) + "前"
    );
  }
}
