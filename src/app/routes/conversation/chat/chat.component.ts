import { AfterViewChecked, Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationStart, Router } from "@angular/router";
import { SettingsService, User, _HttpClient } from "@delon/theme";
import {
  Conversation,
  MessageModel,
} from "@model/application/conversation.interface";
import {
  askNotificationPermission,
  ConversationService,
  EchoService,
} from "@service";
import { NzBadgeModule } from "ng-zorro-antd/badge";
import { zip } from "rxjs";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.less"],
})
export class ChatComponent implements OnInit {
  assignedData: Conversation[] = [];
  unassignedData: Conversation[] = [];
  assignedCount = 0;
  unassignedCount = 0;
  channel: string;
  selectId: string;
  institutionId: string;
  userId: string;
  currentTab: number;
  keyword: string;

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
          this.selectId = "";
        } else if (evt.url.indexOf("/conversation/chat/") == 0) {
          this.selectId = evt.url.split("/conversation/chat/")[1];
        }
      }
    });
  }

  ngOnInit(): void {
    this.initAssignedConversation();
    this.initUnassignedConversation();
    this.initCount();
    askNotificationPermission().then(console.log);

    if (!this.route.children.length) {
      return;
    }
    this.selectId = (this.route.children[0].params as any).getValue().id;
  }

  initCount(): void {
    this.http
      .get("api/conversation/count")
      .subscribe(({ data: { assigned_count, unassigned_count } }) => {
        this.assignedCount = assigned_count;
        this.unassignedCount = unassigned_count;
      });

    // @TODO: 新会话进来的 socket, 更新统计数字.
    // @TODO: 接待回复后, 从 this.unassignedCount 更新到 this.assignedCount
    // @TODO: 关闭会话后, this.assignedCount --
  }

  initAssignedConversation(): void {
    let offset = "";
    if (this.assignedData.length) {
      offset = this.assignedData[this.assignedData.length - 1].id;
    }
    zip(
      this.conversationSrv.getConversationList("assigned", this.keyword, offset)
    ).subscribe(([assignedData]) => {
      this.institutionId = assignedData.data.institution_id;
      this.userId = assignedData.data.user_id;
      this.assignedData = this.assignedData.concat(
        assignedData.data.conversations
      );

      if (
        this.assignedData.filter(
          (conversation: Conversation) => conversation.id == this.selectId
        ).length
      ) {
        this.currentTab = 2;
      }

      this.echoSrv.Echo.join(
        `institution.${this.institutionId}.assigned.${this.userId}`
      )
        .listen(`.conversation.created`, (conversation: Conversation) => {
          const assigned = this.assignedData;
          this.assignedData = assigned.filter(
            (each) => each.id !== conversation.id
          );
          this.assignedData.unshift(conversation);
        })
        .listen(`.message.created`, (message: MessageModel) => {
          const conversations = this.assignedData.filter(
            (item) => item.id === message.conversation_id
          );
          const conversation = conversations[0];
          if (!conversation) {
            return;
          }

          conversation.last_message = message;
          conversation.updated_at = conversation.last_reply_at =
            message.created_at;
        });
    });
  }

  initUnassignedConversation(): void {
    let offset = "";
    if (this.unassignedData.length) {
      offset = this.unassignedData[this.unassignedData.length - 1].id;
    }
    zip(
      this.conversationSrv.getConversationList(
        "unassigned",
        this.keyword,
        offset
      )
    ).subscribe(([unassignedData]) => {
      this.institutionId = unassignedData.data.institution_id;
      this.userId = unassignedData.data.user_id;
      this.unassignedData = this.unassignedData.concat(
        unassignedData.data.conversations
      );

      this.echoSrv.Echo.join(`institution.${this.institutionId}`)
        .listen(`.conversation.created`, (conversation: Conversation) => {
          const unassigned = this.unassignedData;
          this.unassignedData = unassigned.filter(
            (each) => each.id != conversation.id
          );
          if (
            this.assignedData.filter((each) => each.id == conversation.id)
              .length > 0
          ) {
            return;
          }
          this.unassignedData.unshift(conversation);
        })
        .listen(`.message.created`, (message: MessageModel) => {
          const conversations = this.unassignedData.filter(
            (item) => item.id == message.conversation_id
          );
          const conversation = conversations[0];
          if (!conversation) {
            return;
          }

          conversation.last_message = message;
          conversation.updated_at = conversation.last_reply_at =
            message.created_at;
        });
    });
  }

  doNav(): void {
    if (this.assignedCount > 0) {
      return; // 不要自动选择
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
      this.selectId = "";
      // this.navigate(0);
    }
  }

  to(item: { id: any }): void {
    this.selectId = item.id;
    // localStorage.setItem("selectId", JSON.stringify(item.id));
    this.navigate(item.id);
  }

  navigate(id: any): void {
    const url = `/conversation/chat/${id}`;
    this.router.navigateByUrl(url);
  }
}
