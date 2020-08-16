import { Component, OnInit } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { zip } from "rxjs";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.less"],
})
export class ChatComponent implements OnInit {
  assignedData = [];
  unassignedData = [];
  parmaTypes = {
    assigned: {
      type: "assigned",
    },
    unassigned: {
      type: "unassigned",
    },
  };
  constructor(private http: _HttpClient) {}

  ngOnInit(): void {
    this.getConversationList();
  }

  getConversationList(): void {
    zip(
      this.http.get("api/conversation/list", this.parmaTypes.assigned),
      this.http.get("api/conversation/list", this.parmaTypes.unassigned)
    ).subscribe(([assignedData, unassignedData]) => {
      console.log(assignedData);
      this.assignedData = assignedData.data.conversations;
      this.unassignedData = unassignedData.data.conversations;
      console.log(this.unassignedData);
    });
  }
}
