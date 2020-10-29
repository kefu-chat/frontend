import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { _HttpClient } from "@delon/theme";

@Component({
  selector: "app-pricing",
  templateUrl: "./pricing.component.html",
  styleUrls: [
    "../../layout/front/front.component.css",
    "./pricing.component.css",
  ],
})
export class PricingComponent {
  constructor(private http: _HttpClient, public router: Router) {}
}
