import { AfterViewChecked, Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavigationStart, Router } from "@angular/router";
import { _HttpClient } from "@delon/theme";
import {
  ConversationService,
  EchoService,
  askNotificationPermission,
} from "@service";
import { zip } from "rxjs";

@Component({
  selector: "app-chat",
  templateUrl: "./ungreeted-visitor.component.html",
  styleUrls: ["./ungreeted-visitor.component.less"],
})
export class UngreetedVisitorComponent implements OnInit {
  conversations = [];
  channel: String;
  selectId: number = Number(localStorage.getItem("selectId"));
  institutionId: String;
  userId: String;
  type: string = "online";
  constructor(
    private http: _HttpClient,
    private router: Router,
    private conversationSrv: ConversationService,
    private echoSrv: EchoService
  ) {}

  ngOnInit(): void {
    this.getConversationList();
    askNotificationPermission().then(console.log);
  }

  getConversationList(): void {
    zip(this.conversationSrv.getVisitorList({ type: this.type })).subscribe(
      ([visitors]) => {
        console.log(visitors);
        this.institutionId = visitors.data.institution_id;
        this.userId = visitors.data.user_id;
        this.conversations = visitors.data.conversations;

        this.echoSrv.Echo.join(`institution.${this.institutionId}`).listen(
          `.visitors.arrival`,
          (e) => {
            this.conversations.unshift(e);
          }
        );
      }
    );
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
