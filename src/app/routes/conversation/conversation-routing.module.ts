import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ChatDetailComponent } from "./chat-detail/chat-detail.component";
import { ChatComponent } from "./chat/chat.component";
import { UngreetedVisitorComponent } from "./ungreeted-visitor/ungreeted-visitor.component";
import { UngreetedVisitorDetailComponent } from "./ungreeted-visitor-detail/ungreeted-visitor-detail.component";

const routes: Routes = [
  {
    path: "chat",
    component: ChatComponent,
    children: [{ path: ":id", component: ChatDetailComponent }],
  },
  {
    path: "visitor",
    component: UngreetedVisitorComponent,
    children: [{ path: ":id", component: UngreetedVisitorDetailComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConversationRoutingModule {}
