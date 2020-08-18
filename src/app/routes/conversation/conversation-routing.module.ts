import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ChatDetailComponent } from "./chat-detail/chat-detail.component";
import { ChatComponent } from "./chat/chat.component";

const routes: Routes = [
  {
    path: "chat",
    component: ChatComponent,
    children: [{ path: ":id", component: ChatDetailComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConversationRoutingModule {}
