import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationStart, Router } from "@angular/router";
import { SettingsService, User as SystemUser, _HttpClient } from "@delon/theme";
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
import { BehaviorSubject, Observable, Subscription, zip } from "rxjs";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.less"],
})
export class ChatComponent implements OnInit {
  assignedList: Conversation[] = [];
  unassignedList: UnassignedSource; // new UnassignedSource(this.http); // Conversation[] = [];
  historyList: Conversation[] = [];
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
    // this.loadUnassignedConversationList();
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

        this.unassignedList = new UnassignedSource(
          this.conversationSrv,
          this.unassignedCount
        );
      });

    // @TODO: 新会话进来的 socket, 更新统计数字.
    // @TODO: 接待回复后, 从 this.unassignedCount 更新到 this.assignedCount
    // @TODO: 关闭会话后, this.assignedCount --
  }

  // 拉取带分页的已分配
  loadAssignedConversationList(): void {
    let offset = "";
    if (this.assignedList.length) {
      offset = this.assignedList[this.assignedList.length - 1].id;
    }
    zip(
      this.conversationSrv.getConversationList("assigned", this.keyword, offset)
    ).subscribe(([assignedList]) => {
      this.assignedList = this.assignedList.concat(
        assignedList.data.conversations
      );

      if (
        this.assignedList.filter(
          (conversation: Conversation) => conversation.id == this.selectId
        ).length
      ) {
        this.currentTab = 1;
      }
    });
  }

  // 拉取带分页的待分配
  loadUnassignedConversationList(): void {
    // let offset = "";
    // if (this.unassignedList.length) {
    //   offset = this.unassignedList[this.unassignedList.length - 1].id;
    // }
    // zip(
    //   this.conversationSrv.getConversationList(
    //     "unassigned",
    //     this.keyword,
    //     offset
    //   )
    // ).subscribe(([unassignedList]) => {
    //   this.unassignedList = this.unassignedList.concat(
    //     unassignedList.data.conversations
    //   );
    // });
  }

  // 拉取带分页的历史
  loadHistoryConversationList(): void {
    let offset = "";
    if (this.historyList.length) {
      offset = this.historyList[this.historyList.length - 1].id;
    }
    zip(
      this.conversationSrv.getConversationList("history", this.keyword, offset)
    ).subscribe(([historyList]) => {
      this.historyList = this.historyList.concat(
        historyList.data.conversations
      );

      if (
        this.historyList.filter(
          (conversation: Conversation) => conversation.id == this.selectId
        ).length
      ) {
        this.currentTab = 2;
      }
    });
  }

  // 从第一页刷新已分配
  initAssignedConversationList(): void {
    const offset = "";
    zip(
      this.conversationSrv.getConversationList("assigned", this.keyword, offset)
    ).subscribe(([assignedList]) => {
      this.assignedList = assignedList.data.conversations;
    });
  }

  // 从第一页刷新待分配
  initUnassignedConversationList(): void {
    // const offset = "";
    // zip(
    //   this.conversationSrv.getConversationList(
    //     "unassigned",
    //     this.keyword,
    //     offset
    //   )
    // ).subscribe(([unassignedList]) => {
    //   this.unassignedList = unassignedList.data.conversations;
    // });
  }

  // 从第一页刷新历史
  initHistoryConversationList(): void {
    const offset = "";
    zip(
      this.conversationSrv.getConversationList("history", this.keyword, offset)
    ).subscribe(([historyList]) => {
      this.historyList = historyList.data.conversations;
    });
  }

  initAssignedConversationSocket(): void {
    this.echoSrv.Echo.join(
      `institution.${this.user.institution_id}.assigned.${this.user.id}`
    )
      .listen(`.conversation.created`, (conversation: Conversation) => {
        const assigned = this.assignedList;
        this.assignedList = assigned.filter(
          (each) => each.id !== conversation.id
        );
        this.assignedList.unshift(conversation);
      })
      .listen(`.message.created`, (message: MessageModel) => {
        const arr = ["assignedList", "unassignedList"];
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
        const unassigned = this.unassignedList;
        // this.unassignedList = unassigned.filter(
        //   (each) => each.id != conversation.id
        // );
        // if (
        //   this.assignedList.filter((each) => each.id == conversation.id)
        //     .length > 0
        // ) {
        //   return;
        // }
        // this.unassignedList.unshift(conversation);
        this.unassignedCount++;
      })
      .listen(`.message.created`, (message: MessageModel) => {
        // const conversations = this.unassignedList.filter(
        //   (item) => item.id == message.conversation_id
        // );
        // const conversation = conversations[0];
        // if (!conversation) {
        //   return;
        // }
        // conversation.last_message = message;
        // conversation.updated_at = conversation.last_reply_at =
        //   message.created_at;
      });
  }

  doNav(): void {
    if (this.assignedCount > 0) {
      return; // 不要自动选择
    } else {
      this.selectId = "";
    }
  }

  to(item: { id: any }): void {
    this.selectId = item.id;
    this.router.navigateByUrl(`/conversation/chat/${item.id}`);
  }

  getMessageOutput(data: { id: string; message: any }): void {
    // console.log(this.assignedList.filter((v) => v.id == data.id));
    // console.log(data.id);
  }

  getConversationLoad(conversation: Conversation): void {
    if (
      // !this.unassignedList.concat(this.assignedList)
      this.assignedList.filter((c) => c.id === conversation.id).length
    ) {
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

class UnassignedSource extends DataSource<Conversation> {
  private pageSize = 20;
  private cachedData = Array.from<Conversation>({ length: this.length });
  private latestList: Conversation[] = [];
  private fetchedPages = new Set<number>();
  private dataStream = new BehaviorSubject<Conversation[]>(this.cachedData);
  private subscription = new Subscription();

  constructor(
    private conversationSrv: ConversationService,
    public length: number
  ) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<Conversation[]> {
    this.subscription.add(
      collectionViewer.viewChange.subscribe((range) => {
        const startPage = this.getPageForIndex(range.start);
        const endPage = this.getPageForIndex(range.end - 1);
        for (let i = startPage; i <= endPage; i++) {
          this.fetchPage(i);
        }
      })
    );
    return this.dataStream;
  }

  disconnect(): void {
    this.subscription.unsubscribe();
  }

  private getPageForIndex(index: number): number {
    return Math.floor(index / this.pageSize);
  }

  private fetchPage(page: number): void {
    if (this.fetchedPages.has(page)) {
      return;
    }
    this.fetchedPages.add(page);

    let offset = null;
    if (this.latestList && this.latestList.length) {
      offset = this.latestList[this.latestList.length - 1].id;
    }
    this.conversationSrv
      .getConversationList("unassigned", "", offset)
      .subscribe((res) => {
        this.latestList = res.data.conversations;
        this.cachedData.splice(
          page * this.pageSize,
          this.pageSize,
          ...res.data.conversations
        );
        this.dataStream.next(this.cachedData);
      });
  }
}
