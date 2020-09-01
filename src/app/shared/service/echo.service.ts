import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import Echo from "laravel-echo";

@Injectable({
  providedIn: "root",
})
export class EchoService {
  Echo: Echo;
  constructor() {}

  init(): void {
    this.Echo = new Echo({
      broadcaster: "socket.io",
      host: environment.socketHost,
    });
  }
}
