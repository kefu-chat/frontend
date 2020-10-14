import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Subject } from "rxjs";
interface Message {
  type: string;
  data: any;
}

@Injectable({
  providedIn: "root",
})
export class SubscribeService {
  private subject = new Subject<any>();

  send(v: Message): void {
    this.subject.next(v);
  }

  on(): Observable<Message> {
    return this.subject.asObservable();
  }
}
