import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationStart, Router } from "@angular/router";
import { SettingsService, _HttpClient, User as SystemUser } from "@delon/theme";
import {
  Conversation,
  CountInterface,
  MessageModel,
  User,
} from "@model/application/conversation.interface";
import { Res } from "@model/common/common.interface";
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
  historyData: Conversation[] = [];
  assignedCount = 0;
  unassignedCount = 0;
  historyCount = 0;
  channel: string;
  selectId: string;
  institutionId: string;
  currentTab: number;
  keyword: string;

  get user(): SystemUser | User {
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
    this.loadAssignedConversationList();
    this.loadUnassignedConversationList();
    this.loadHistoryConversationList();
    this.initAssignedConversationSocket();
    this.initUnassignedConversationSocket();
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
      .subscribe((res: Res<CountInterface>) => {
        this.assignedCount = res.data.assigned_count;
        this.unassignedCount = res.data.unassigned_count;
        this.historyCount = res.data.history_count;
      });

    // @TODO: 新会话进来的 socket, 更新统计数字.
    // @TODO: 接待回复后, 从 this.unassignedCount 更新到 this.assignedCount
    // @TODO: 关闭会话后, this.assignedCount --
  }

  // 拉取带分页的已分配
  loadAssignedConversationList(): void {
    let offset = "";
    if (this.assignedData.length) {
      offset = this.assignedData[this.assignedData.length - 1].id;
    }
    zip(
      this.conversationSrv.getConversationList("assigned", this.keyword, offset)
    ).subscribe(([assignedData]) => {
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
    });
  }

  // 拉取带分页的待分配
  loadUnassignedConversationList(): void {
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
      this.unassignedData = this.unassignedData.concat(
        unassignedData.data.conversations
      );
    });
  }

  // 拉取带分页的历史
  loadHistoryConversationList(): void {
    let offset = "";
    if (this.historyData.length) {
      offset = this.historyData[this.historyData.length - 1].id;
    }
    zip(
      this.conversationSrv.getConversationList("history", this.keyword, offset)
    ).subscribe(([historyData]) => {
      this.historyData = this.historyData.concat(
        historyData.data.conversations
      );

      if (
        this.historyData.filter(
          (conversation: Conversation) => conversation.id == this.selectId
        ).length
      ) {
        this.currentTab = 3;
      }
    });
  }

  // 从第一页刷新已分配
  initAssignedConversationList(): void {
    const offset = "";
    zip(
      this.conversationSrv.getConversationList("assigned", this.keyword, offset)
    ).subscribe(([assignedData]) => {
      this.assignedData = assignedData.data.conversations
    });
  }

  // 从第一页刷新待分配
  initUnassignedConversationList(): void {
    const offset = "";
    zip(
      this.conversationSrv.getConversationList(
        "unassigned",
        this.keyword,
        offset
      )
    ).subscribe(([unassignedData]) => {
      this.unassignedData = unassignedData.data.conversations
    });
  }

  // 从第一页刷新历史
  initHistoryConversationList(): void {
    const offset = "";
    zip(
      this.conversationSrv.getConversationList("history", this.keyword, offset)
    ).subscribe(([historyData]) => {
      this.historyData = historyData.data.conversations
    });
  }

  initAssignedConversationSocket(): void {
    this.echoSrv.Echo.join(
      `institution.${this.user.institution_id}.assigned.${this.user.id}`
    )
      .listen(`.conversation.created`, (conversation: Conversation) => {
        const assigned = this.assignedData;
        this.assignedData = assigned.filter(
          (each) => each.id !== conversation.id
        );
        this.assignedData.unshift(conversation);
      })
      .listen(`.message.created`, (message: MessageModel) => {
        const arr = ["assignedData", "unassignedData"];
        let conversations = [];
        for (const i of arr) {
          conversations = this[i].filter(
            (item) => item.id === message.conversation_id
          );
          if (conversations.length == 0) {
            continue;
          }
        }

        const conversation = conversations[0];

        conversation.last_message = message;
        conversation.updated_at = conversation.last_reply_at =
          message.created_at;
        if (message.sender_type_text == "user") {
          if (!conversation.user) {
            this.unassignedCount--;
          }
          conversation.user = message.sender;
        }
      });
  }

  initUnassignedConversationSocket(): void {
    this.echoSrv.Echo.join(`institution.${this.user.institution_id}`)
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
        this.unassignedCount++;
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
  }

  doNav(): void {
    if (this.assignedCount > 0) {
      return; // 不要自动选择
      if (this.selectId) {
        const arr = [...this.assignedData, ...this.unassignedData];
        for (const i of arr) {
          if (i.id === this.selectId) {
          }
        }
      } else {
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
    this.router.navigateByUrl(`/conversation/chat/${item.id}`);
  }

  getMessageOutput(data: { id: string; message: any }): void {
    // console.log(this.assignedData.filter((v) => v.id == data.id));
    // console.log(data.id);
  }

  getConversationLoad(conversation: Conversation): void {
    if (!this.unassignedData.concat(this.assignedData).filter(c => c.id === conversation.id).length) {
      this.initUnassignedConversationList();
      this.initAssignedConversationList();
    }
  }

  selectChange(index: number): void {
    switch (index) {
      case 0:
        this.initUnassignedConversationList();
        break;

      case 1:
        this.initAssignedConversationList();
        break;

      case 2:
        this.initHistoryConversationList();
        break;
    
      default:
        break;
    }
  }
}
