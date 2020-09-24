import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import Echo from "laravel-echo";

@Injectable({
  providedIn: "root",
})
export class EchoService {
  Echo: any;
  constructor() {}

  init(): void {
    let store = JSON.parse(localStorage.getItem("_token"));
    if (store) {
      const token = store.token;
      this.Echo = new Echo({
        broadcaster: "socket.io",
        host: environment.socketHost,
        auth: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
    }
  }
}
