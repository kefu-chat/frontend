import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { _HttpClient } from "@delon/theme";
import { SettingsService, User } from "@delon/theme";

import {
  MessageData,
  MessageModel,
} from "@model/application/conversation.interface";
import { Res } from "@model/common/common.interface";
@Component({
  selector: "app-chat-detail",
  templateUrl: "./chat-detail.component.html",
  styleUrls: ["./chat-detail.component.less"],
})
export class ChatDetailComponent implements OnInit {
  messageList: MessageModel[] = [];
  id: number;
  commit = "";
  get user(): User {
    return this.settings.user;
  }

  get nowfirstMsgId(): number {
    return this.messageList[0].id;
  }

  has_previous: boolean;
  constructor(
    private route: ActivatedRoute,
    private http: _HttpClient,
    private settings: SettingsService
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
    this.http.get(api).subscribe((res: Res<MessageData>) => {
      if (res.success) {
        if (flagId) {
          this.messageList = [...res.data.messages, ...this.messageList];
        } else {
          this.messageList = res.data.messages;
        }
        this.has_previous = res.data.has_previous;
      }
    });
  }

  loadPreMore(): void {
    this.getData(this.id, this.nowfirstMsgId);
  }
}
