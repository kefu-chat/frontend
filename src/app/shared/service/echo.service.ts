import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

@Injectable({
  providedIn: "root",
})
export class EchoService {
  Echo: any;
  constructor() {}

  init(): void {
    const store = JSON.parse(localStorage.getItem("_token"));
    if (store) {
      const token = store.token;

      this.Echo = new Echo({
        // broadcaster: "socket.io",
        // host: environment.socketHost,
        // auth: {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // },
        broadcaster: "pusher",
        client: new Pusher(`test`, {
          // broadcaster: "socket.io",
          // host: environment.socketHost,
          // auth: {
          //   headers: {
          //     Authorization: `Bearer ${token}`,
          //   },
          // },
          auth: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          authEndpoint: environment.apiUrl + "broadcasting/auth",
          httpHost: new URL(environment.apiUrl).hostname,
          httpPort: parseInt(new URL(environment.apiUrl).port, 10),
          httpsPort: parseInt(new URL(environment.apiUrl).port, 10),
          wsHost: new URL(environment.socketHost).hostname,
          wsPort: parseInt(new URL(environment.socketHost).port, 10),
          wssPort: parseInt(new URL(environment.socketHost).port, 10),
          disableStats: true,
          forceTLS: new URL(environment.socketHost).protocol == "https:",
          enabledTransports: [
            new URL(environment.socketHost).protocol == "https:" ? "wss" : "ws",
          ],
        }),
      });

      console.log(this.Echo)
    }
  }
}
