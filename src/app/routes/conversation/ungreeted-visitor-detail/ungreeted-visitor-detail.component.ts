import { Component, ElementRef, EventEmitter, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { _HttpClient } from "@delon/theme";
import { SettingsService, User } from "@delon/theme";
import { NzModalService } from "ng-zorro-antd/modal";
import {
  Conversation,
  MessageData,
  MessageModel,
  Visitor,
} from "@model/application/conversation.interface";
import { Res } from "@model/common/common.interface";
import {
  ConversationService,
  EchoService,
  askNotificationPermission,
} from "@service";
import { NzUploadChangeParam, NzUploadFile } from "ng-zorro-antd/upload";
import { EmojiModule } from "@ctrl/ngx-emoji-mart/ngx-emoji";
import { zip } from "rxjs";

@Component({
  selector: "app-ungreeted-visitor-detail",
  templateUrl: "./ungreeted-visitor-detail.component.html",
  styleUrls: ["./ungreeted-visitor-detail.component.less"],
})
export class UngreetedVisitorDetailComponent implements OnInit {
  messageList: MessageModel[] = [];
  id: any;
  channel: string;
  content = "";
  messageEl: HTMLElement;
  fileList: NzUploadFile[] = [];
  picUrl = "";
  conversation: Conversation;
  visitor: Visitor;
  imgWidth: number;
  get user(): User {
    return this.settings.user;
  }

  get nowfirstMsgId(): string {
    return this.messageList[0].id;
  }

  get userAnnotation(): string {
    let arr = [];
    if (this.visitor.unique_id != this.visitor.name) {
      arr.push(this.visitor.unique_id);
    }
    if (this.typing) {
      arr.push("对方正在输入中");
    }
    if (!this.conversation.online_status) {
      arr.push("已离线");
    }
    let annotation = arr.join(", ");
    if (annotation) {
      annotation = "(" + annotation + ")";
    }
    return annotation;
  }

  has_previous: boolean;
  typing: boolean;
  socket: any;
  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private settings: SettingsService,
    private el: ElementRef<HTMLElement>,
    private conversationSrv: ConversationService,
    private echoSrv: EchoService,
    private modal: NzModalService,
    private http: _HttpClient
  ) {}

  ngOnInit(): void {
    askNotificationPermission().then(console.log);

    this.route.params.subscribe((params: Params) => {
      this.id = params.id;
      // tslint:disable-next-line: triple-equals
      if (this.id == 0) {
        return false;
      }
      this.channel = `conversation.${this.id}`;
      this.getData(this.id, "", () => {
        if (!this.messageEl) return;
        this.messageEl.scrollTop = this.messageEl.scrollHeight;
      });
      for (const i of Object.keys(this.echoSrv.Echo.connector.channels)) {
        if (i.indexOf("presence-conversation.") == 0) {
          this.echoSrv.Echo.leave(i);
        }
      }
      this.socket = this.echoSrv.Echo.join(this.channel)
        .here(console.log)
        .joining(console.log)
        .leaving((user) => {
          if (user.id != this.visitor.id) {
            return;
          }

          this.conversation.online_status = false;
        })
        // .listen(".message.created", (e) => {
        //   this.messageList.push(e);
        //   setTimeout(() => {
        //     this.scrollTo();
        //   }, 200);
        // })
        .listenForWhisper("message", (e) => {
          this.messageList.push(e);
          setTimeout(() => {
            this.scrollTo();
          }, 200);
        })
        .listenForWhisper("startTyping", (evt) => {
          console.log(evt);
          this.typing = true;
        })
        .listenForWhisper("stopTyping", (evt) => {
          console.log(evt);
          this.typing = false;
        });
    });
  }

  getData(id: string, offset?: string, callback?: Function): void {
    this.conversationSrv
      .getMessages(id, offset)
      .subscribe((res: Res<MessageData>) => {
        if (res.success) {
          if (offset) {
            this.messageList = [...res.data.messages, ...this.messageList];
          } else {
            this.messageList = res.data.messages;
          }
          this.conversation = res.data.conversation;
          const url = new URL(this.conversation.url);
          this.conversation.hostname = url.hostname;
          this.visitor = this.conversation.visitor;
          this.has_previous = res.data.has_previous;
          this.messageEl = this.el.nativeElement.querySelector(".message");
          setTimeout(() => {
            callback();
          }, 200);
        }
      });
  }

  scrollTo(): void {
    if (!this.messageEl) return;
    this.messageEl.scrollTop = this.messageEl.scrollHeight;
  }

  loadPreMore(): void {
    this.getData(this.id, this.nowfirstMsgId, () => {
      if (!this.messageEl) return;
      this.messageEl.scrollTop = 0;
    });
  }

  whisper(message): void {
    this.socket.whisper("message", message);
  }

  sendMessage(): void {
    const content = {
      1: this.content,
      2: this.picUrl,
    };
    for (const i of Object.keys(content)) {
      const j = Number(i);
      if (content[j]) {
        const req = {
          type: Number(j),
          content: content[j],
        };
        const message = {
          ...req,
          id: parseInt((Math.random() * 9999999).toString()).toString(),
          sender_id: this.user.id,
          sender_type: "App\\Models\\User",
          sender_type_text: "user",
          sender: this.user,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          conversation_id: this.conversation.id.toString(),
        };

        this.conversationSrv
          .sendMessage(this.id, req)
          .subscribe((res: Res<any>) => {
            if (res.success) {
              this.content = "";
              this.picUrl = "";
              this.fileList = [];
              this.whisper(message);
              this.messageList.push(message);

              setTimeout(() => {
                this.scrollTo();
              }, 200);
            }
          });
      }
    }
  }

  keyEnter(e: KeyboardEvent): void {
    this.stopTyping(e);
    if (this.content) {
      this.sendMessage();
    } else {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  startTyping(e: KeyboardEvent): void {
    this.socket.whisper("startTyping", this.user);
  }

  stopTyping(e: KeyboardEvent): void {
    this.socket.whisper("stopTyping", { name: "" });
  }

  paste(e: ClipboardEvent): void {
    console.log(e);
  }

  drag(e): void {
    console.log(e);
  }

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status === "done") {
      this.picUrl = info.file.response.data.url;
    }
  }

  selectEmoji(evt): void {
    console.log(evt.emoji.native);
  }

  toList(): void {
    const url = `/conversation/visitor`;
    this.router.navigateByUrl(url);
  }

  terminateConversation(): void {
    this.modal.confirm({
      nzTitle: "确认终止会话?",
      nzOkText: "终止",
      nzOkType: "danger",
      nzOnOk: () => {
        zip(
          this.http.post(`api/conversation/${this.conversation.id}/terminate`)
        ).subscribe((terminate) => {
          // @todo: after terminated
          this.toList();
        });
      },
      nzCancelText: "不终止",
      nzAutofocus: "ok",
    });
  }
}
