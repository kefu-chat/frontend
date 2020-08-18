import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";

@Component({
  selector: "app-chat-detail",
  templateUrl: "./chat-detail.component.html",
  styleUrls: ["./chat-detail.component.less"],
})
export class ChatDetailComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      console.log(params);
    });
  }
}
