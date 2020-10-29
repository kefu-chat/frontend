import { Component } from "@angular/core";
import { Router } from '@angular/router';
import { _HttpClient } from "@delon/theme";

@Component({
  selector: "app-front",
  templateUrl: "./front.component.html",
  styleUrls: ["./front.component.css", ],
})
export class LayoutFrontComponent {
  constructor(
    public router: Router
  ) {
  }
}
