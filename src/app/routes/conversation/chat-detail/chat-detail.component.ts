import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { EmojiEvent } from "@shared/lib/ngx-emoji-mart/ngx-emoji";
import { _HttpClient } from "@delon/theme";
import { SettingsService, User as SystemUser } from "@delon/theme";
import {
  Conversation,
  MessageData,
  MessageModel,
  MessageUser,
  Visitor,
  User
} from "@model/application/conversation.interface";
import { Res } from "@model/common/common.interface";
import {
  askNotificationPermission,
  ConversationService,
  EchoService,
  playIncomingAudio,
  playOutcomingAudio,
} from "@service";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzModalService } from "ng-zorro-antd/modal";
import { NzUploadChangeParam, NzUploadFile } from "ng-zorro-antd/upload";
import { zip } from "rxjs";

@Component({
  selector: "app-chat-detail",
  templateUrl: "./chat-detail.component.html",
  styleUrls: ["./chat-detail.component.less"],
})
export class ChatDetailComponent implements OnInit {
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
  // emojis = [
  //   {
  //     name: "custom",
  //     shortNames: ["custom"],
  //     text: "",
  //     emoticons: [],
  //     keywords: ["test", "flag"],
  //     spriteUrl: "http://dev.fastsupport.cn/img/64.png",
  //     sheet_x: 1,
  //     sheet_y: 1,
  //     size: 64,
  //     sheetColumns: 57,
  //     sheetRows: 57,
  //   },
  // ];
  @Input()
  set sid(id: string) {
    this.id = id;
    this.initData();
  }
  @Output() messageOutput: EventEmitter<any> = new EventEmitter();
  @Output() conversationLoad: EventEmitter<any> = new EventEmitter();

  get user(): SystemUser | User {
    return this.settings.user;
  }
  get nowfirstMsgId(): string {
    return this.messageList[0].id;
  }
  get userAnnotation(): string {
    const arr = [];
    if (this.visitor.unique_id !== this.visitor.name) {
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
    private http: _HttpClient,
    private msg: NzMessageService
  ) {}

  ngOnInit(): void {
    askNotificationPermission().then(console.log);
  }

  initData(): void {
    // tslint:disable-next-line: triple-equals
    if (this.id == 0 || !this.id) {
      return;
    }
    this.channel = `conversation.${this.id}`;
    this.getData(this.id, "", () => {
      if (!this.messageEl) {
        return;
      }
      this.messageEl.scrollTop = this.messageEl.scrollHeight;
    });
    for (const i of Object.keys(this.echoSrv.Echo.connector.channels)) {
      if (i.indexOf("presence-conversation.") === 0) {
        this.echoSrv.Echo.leave(i);
      }
    }
    this.socket = this.echoSrv.Echo.join(this.channel)
      .here(console.log)
      .joining(console.log)
      .leaving((user: MessageUser) => {
        if (user.id !== this.visitor.id) {
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
        playIncomingAudio();
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
  }

  getData(id: string, offset?: string, callback?: () => void): void {
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
          this.conversationLoad.emit(this.conversation);

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
    if (!this.messageEl) {
      return;
    }
    this.messageEl.scrollTop = this.messageEl.scrollHeight;
  }

  loadPreMore(): void {
    this.getData(this.id, this.nowfirstMsgId, () => {
      if (!this.messageEl) {
        return;
      }
      this.messageEl.scrollTop = 0;
    });
  }

  whisper(message: MessageModel): void {
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
          id: parseInt((Math.random() * 9999999).toString(), null).toString(),
          sender_id: this.user.id,
          sender_type: "App\\Models\\User",
          sender_type_text: "user",
          sender: this.user,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          conversation_id: this.conversation.id.toString(),
        };

        this.conversationSrv.sendMessage(this.id, req).subscribe(
          (res: Res<any>) => {
            if (res.success) {
              this.content = "";
              this.picUrl = "";
              this.fileList = [];
              this.whisper(message);
              this.messageList.push(message);
              this.messageOutput.emit({ id: this.id, message });
              this.messageOutput.emit({ id: this.id, message });

              setTimeout(() => {
                this.scrollTo();
                // playOutcomingAudio();
              }, 200);
            }
          },
          (err: { error: Res<any> }) => {
            this.msg.error(err.error.message);
          }
        );
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

  drag(e: DragEvent): void {
    console.log(e);
  }

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status === "done") {
      this.picUrl = info.file.response.data.url;
    }
  }

  selectEmoji(evt: EmojiEvent): void {
    const textarea = document.querySelector("#msgInput") as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const left = this.content.substr(0, start);
    const right = this.content.substr(start);

    this.content = left + evt.emoji.native + right;
  }

  toList(): void {
    const url = `/conversation/chat`;
    this.router.navigateByUrl(url);
  }

  transferConversation(): void {}

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

  getGeoLocation(): string {
    return [
      this.conversation.geo.country,
      this.conversation.geo.province,
      this.conversation.geo.city,
      this.conversation.geo.area,
    ]
      .filter((a) => a)
      .join(", ");
  }
}
