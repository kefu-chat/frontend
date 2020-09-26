import { NgModule } from "@angular/core";
import { SharedModule } from "@shared";
import { ChatDetailComponent } from "./chat-detail/chat-detail.component";
import { ChatComponent } from "./chat/chat.component";
import { ConversationRoutingModule } from "./conversation-routing.module";
import { UngreetedVisitorComponent } from "./ungreeted-visitor/ungreeted-visitor.component";

const COMPONENTS = [];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, ConversationRoutingModule],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
    ChatComponent,
    ChatDetailComponent,
    UngreetedVisitorComponent,
  ],
})
export class ConversationModule {}
