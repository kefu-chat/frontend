import { Component, OnInit } from "@angular/core";
import { SettingsService, _HttpClient, User as SystemUser } from "@delon/theme";
import {
  User,
} from "@model/application/conversation.interface";

@Component({
  selector: "app-bot",
  templateUrl: "./bot.component.html",
  styleUrls: ["./bot.component.less"],
})
export class BotComponent implements OnInit {
  get user(): SystemUser | User {
    return this.settings.user;
  }

  constructor(
    private settings: SettingsService
  ) {
  }

  ngOnInit(): void {
  }
}
