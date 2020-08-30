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

  // 获取访客列表
  getVistorList(params: { type: string }): Observable<Res<ConversationModel>> {
    return this.http.get("api/conversation/list", params);
  }

  // 获取聊天记录
  getMessages(id: number, flagId?: number): Observable<Res<MessageData>> {
    const api = flagId
      ? `api/conversation/${id}/messages?offset=${flagId}`
      : `api/conversation/${id}/messages`;

    return this.http.get(api);
  }

  // 发送消息
  sendMessage(id: number, data: SendMessageModel): Observable<Res<any>> {
    return this.http.post(`api/conversation/${id}/send-message`, data);
  }
}
