import { NgModule } from "@angular/core";
import { SharedModule } from "@shared";
import { BotComponent } from "./bot/bot.component";
import { BotRoutingModule } from "./bot-routing.module"

const COMPONENTS = [];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, BotRoutingModule],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
    BotComponent
  ],
})
export class BotModule {}
