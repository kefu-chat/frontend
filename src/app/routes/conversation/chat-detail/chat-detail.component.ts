import { Component, ElementRef, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { _HttpClient } from "@delon/theme";
import { SettingsService, User } from "@delon/theme";

import {
  MessageData,
  MessageModel,
} from "@model/application/conversation.interface";
import { Res } from "@model/common/common.interface";
import { ConversationService } from "@service";

@Component({
  selector: "app-chat-detail",
  templateUrl: "./chat-detail.component.html",
  styleUrls: ["./chat-detail.component.less"],
})
export class ChatDetailComponent implements OnInit {
  messageList: MessageModel[] = [];
  id: number;
  content = "";
  messageEl: HTMLElement;
  get user(): User {
    return this.settings.user;
  }

  get nowfirstMsgId(): number {
    return this.messageList[0].id;
  }

  has_previous: boolean;
  constructor(
    private route: ActivatedRoute,
    private settings: SettingsService,
    private el: ElementRef<HTMLElement>,
    private conversationSrv: ConversationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params.id;
      this.getData(this.id);
    });
  }

  getData(id: number, flagId?: number): void {
    const api = flagId
      ? `api/conversation/${id}/messages?offset=${flagId}`
      : `api/conversation/${id}/messages`;
    this.conversationSrv
      .getMessages(id, flagId)
      .subscribe((res: Res<MessageData>) => {
        if (res.success) {
          if (flagId) {
            this.messageList = [...res.data.messages, ...this.messageList];
          } else {
            this.messageList = res.data.messages;
          }
          this.has_previous = res.data.has_previous;
          this.messageEl = this.el.nativeElement.querySelector(".message");
          setTimeout(() => {
            this.scrollTo();
          }, 200);
          console.log(this.messageEl);
        }
      });
  }

  scrollTo(): void {
    this.messageEl.scrollTop = this.messageEl.scrollHeight;
  }

  loadPreMore(): void {
    this.getData(this.id, this.nowfirstMsgId);
  }

  sendMessage(type: number): void {
    let content: string;
    type === 1 ? (content = this.content) : (content = "http://");
    const req = {
      type,
      content,
    };
    this.conversationSrv
      .sendMessage(this.id, req)
      .subscribe((res: Res<any>) => {
        if (res.success) {
          this.content = "";
        }
      });
  }
}
