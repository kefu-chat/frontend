import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { _HttpClient } from "@delon/theme";
import { SettingsService, User as SystemUser} from "@delon/theme";
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
} from "@service";
import { NzModalService } from "ng-zorro-antd/modal";
import { NzUploadChangeParam, NzUploadFile } from "ng-zorro-antd/upload";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { zip } from "rxjs";
import { NzI18nService } from 'ng-zorro-antd/i18n';

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

  @Input()
  set sid(id: string) {
    this.id = id;
    this.initData();
  }

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
  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private settings: SettingsService,
    private el: ElementRef<HTMLElement>,
    private conversationSrv: ConversationService,
    private echoSrv: EchoService,
    private modal: NzModalService,
    private http: _HttpClient,
    private nzI18n: NzI18nService
  ) {}

  ngOnInit(): void {
    askNotificationPermission().then(console.log);
  }

  initData(): void {
    if (this.id == 0) {
      return;
    }
    this.getData(this.id, "");
  }

  getData(id: string, offset?: string): void {
    this.conversationSrv
      .getMessages(id, offset)
      .subscribe((res: Res<MessageData>) => {
        if (res.success) {
          if (offset) {
            this.messageList = [...res.data.messages, ...this.messageList];
          } else {
            this.messageList = res.data.messages;
          }
          const url = new URL(res.data.conversation.url);
          const hostname = url.hostname;
          this.conversation = {...res.data.conversation, hostname};
          this.visitor = this.conversation.visitor;
          this.has_previous = res.data.has_previous;
        }
      });
  }

  scrollTo(): void {
    if (!this.messageEl) {
      return;
    }
    this.messageEl.scrollTop = this.messageEl.scrollHeight;
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

  toChat(item: { id: any }): void {
    const url = `/conversation/chat/${item.id}`;
    this.router.navigateByUrl(url);
  }

  getGeoLocation(): string {
    if (this.conversation.geo.area) {
      return this.conversation.geo.area;
    }

    return [
      this.conversation.geo.country,
      this.conversation.geo.province,
      this.conversation.geo.city,
    ]
      .filter((a) => a)
      .join(", ");
  }

  fromNow(timeTz: Date | string) {
    return (
      formatDistanceToNow(new Date(timeTz), {
        locale: this.nzI18n.getDateLocale(),
      }) + "前"
    );
  }
}
