import { NgModule } from "@angular/core";
import { SharedModule } from "@shared";
import { ChatComponent } from "./chat/chat.component";
import { ConversationRoutingModule } from "./conversation-routing.module";

const COMPONENTS = [];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, ConversationRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT, ChatComponent],
})
export class ConversationModule {}
