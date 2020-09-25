import { Component, ElementRef, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { _HttpClient } from "@delon/theme";
import { SettingsService, User } from "@delon/theme";
import {
  Conversation,
  MessageData,
  MessageModel,
  Visitor,
} from "@model/application/conversation.interface";
import { Res } from "@model/common/common.interface";
import { ConversationService, EchoService } from "@service";
import { NzUploadChangeParam, NzUploadFile } from "ng-zorro-antd/upload";

@Component({
  selector: "app-chat-detail",
  templateUrl: "./chat-detail.component.html",
  styleUrls: ["./chat-detail.component.less"],
})
export class ChatDetailComponent implements OnInit {
  messageList: MessageModel[] = [];
  id: number;
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

  get nowfirstMsgId(): number {
    return this.messageList[0].id;
  }

  has_previous: boolean;
  typing: boolean;
  socket: any;
  constructor(
    private route: ActivatedRoute,
    private settings: SettingsService,
    private el: ElementRef<HTMLElement>,
    private conversationSrv: ConversationService,
    private echoSrv: EchoService
  ) {}

  ngOnInit(): void {
    this.askNotificationPermission().then(console.log);

    this.route.params.subscribe((params: Params) => {
      this.id = params.id;
      // tslint:disable-next-line: triple-equals
      if (this.id == 0) {
        return false;
      }
      this.channel = `conversation.${this.id}`;
      this.getData(this.id);
      for (const i of Object.keys(this.echoSrv.Echo.connector.channels)) {
        this.echoSrv.Echo.leave(i);
      }
      this.socket = this.echoSrv.Echo.join(this.channel)
        .here(console.log)
        .joining(console.log)
        .leaving(console.log)
        // .listen(".message.created", (e) => {
        //   this.messageList.push(e);
        //   setTimeout(() => {
        //     this.scrollTo();
        //   }, 200);
        // })
        .listenForWhisper("message", (e) => {
          this.messageList.push(e);
          this.askNotificationPermission().then(() => {
            const msg = e;
            let body, image;

            if (msg.type == 1) {
              body = msg.content;
            }
            if (msg.type == 2) {
              body = "[图片消息]";
              image = msg.content;
            }

            const notify = new Notification("您收到新消息", {
              body,
              image,
              vibrate: 1,
            });

            notify.onclick = () => {
              window.focus();

              setTimeout(() => {
                notify.close();
              }, 200);
            };
          });
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

  askNotificationPermission() {
    return new Promise(function (resolve, reject) {
      const permissionResult = Notification.requestPermission(function (
        result
      ) {
        resolve(result);
      });

      if (permissionResult) {
        permissionResult.then(resolve, reject);
      }
    });
  }

  getData(id: number, flagId?: number): void {
    this.conversationSrv
      .getMessages(id, flagId)
      .subscribe((res: Res<MessageData>) => {
        if (res.success) {
          if (flagId) {
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
            this.scrollTo();
          }, 200);
        }
      });
  }

  scrollTo(): void {
    this.messageEl.scrollTop = this.messageEl.scrollHeight;
  }

  loadPreMore(): void {
    this.getData(this.id, this.nowfirstMsgId);
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
        console.log(message);

        this.conversationSrv
          .sendMessage(this.id, req)
          .subscribe((res: Res<any>) => {
            if (res.success) {
              this.content = "";
              this.picUrl = "";
              this.fileList = [];
              setTimeout(() => {
                this.scrollTo();
              }, 200);
            }
          });

        this.whisper(message);
        this.messageList.push(message);
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

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status === "done") {
      this.picUrl = info.file.response.data.url;
    }
  }
}
