import { Injectable } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { SendMessageModel } from "@model/application/conversation.interface";
import {
  ConversationModel,
  MessageData,
} from "@model/application/conversation.interface";
import { Res } from "@model/common/common.interface";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ConversationService {
  constructor(private http: _HttpClient) {}

  // 获取会话列表
  getConversationList(params: {
    type: string;
    offset?: string;
  }): Observable<Res<ConversationModel>> {
    return this.http.get("api/conversation/list", params);
  }

  // 获取聊天记录
  getMessages(id: string, offset?: string): Observable<Res<MessageData>> {
    const api = offset
      ? `api/conversation/${id}/messages?offset=${offset}`
      : `api/conversation/${id}/messages`;

    return this.http.get(api);
  }

  // 获取访客列表
  getVisitorList(params: {
    type: string;
    offset?: string;
  }): Observable<Res<ConversationModel>> {
    return this.http.get("api/conversation/list-ungreeted", params);
  }

  // 发送消息
  sendMessage(id: string, data: SendMessageModel): Observable<Res<any>> {
    return this.http.post(`api/conversation/${id}/send-message`, data);
  }
}
