import { Component } from "@angular/core";
import { _HttpClient } from "@delon/theme";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.less",],
})
export class IndexComponent {
  constructor(private http: _HttpClient) { }
}
