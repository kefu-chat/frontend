import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BotComponent } from "./bot/bot.component";

const routes: Routes = [
  {
    path: "bot",
    component: BotComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BotRoutingModule {}
