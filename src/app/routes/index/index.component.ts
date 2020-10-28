import { Component } from "@angular/core";
import { Router } from '@angular/router';
import { _HttpClient } from "@delon/theme";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.css",],
})
export class IndexComponent {
  constructor(
    private http: _HttpClient,
    private router: Router
  ) {
  }
}
