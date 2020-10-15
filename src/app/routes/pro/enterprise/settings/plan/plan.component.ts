import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-enterprise-settings-plan",
  templateUrl: "./plan.component.html",
  styleUrls: ["./plan.component.less"],
})
export class ProEnterpriseSettingsPlanComponent implements OnInit {
  count = 4;
  array = new Array(this.count);
  constructor() {}

  ngOnInit(): void {}
}
