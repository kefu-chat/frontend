import { AfterViewChecked, Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationStart, Router } from "@angular/router";
import { SettingsService, User, _HttpClient } from "@delon/theme";
import {
  Conversation,
  ConversationModel,
  MessageModel,
} from "@model/application/conversation.interface";
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
  assignedData: Conversation[] = [];
  unassignedData: Conversation[] = [];
  channel: String;
  selectId: any = null;
  institutionId: String;
  userId: String;
  currentTab: Number;
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
    this.initAssignedConversation();
    this.initUnassignedConversation();
    askNotificationPermission().then(console.log);

    try {
      this.selectId = (this.route.children[0].params as any).getValue().id;
    } catch (e) {}
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
      this.doNav();

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
          let assigned = this.assignedData;
          this.assignedData = assigned.filter(
            (each) => each.id != conversation.id
          );
          this.assignedData.unshift(conversation);
        })
        .listen(`.message.created`, (message: MessageModel) => {
          let conversations = this.assignedData.filter(
            (conversation) => conversation.id == message.conversation_id
          );
          let conversation = conversations[0];
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
          let unassigned = this.unassignedData;
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
          let conversations = this.unassignedData.filter(
            (conversation) => conversation.id == message.conversation_id
          );
          let conversation = conversations[0];
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
