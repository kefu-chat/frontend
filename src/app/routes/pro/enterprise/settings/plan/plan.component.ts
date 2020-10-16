import { Component, OnInit } from "@angular/core";
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';

export interface Plan {
  id: string;
  name: string;
  price_monthly: null | number;
  price_annually: null | number;
  price_biennially: null | number;
  price_triennially: null | number;
  available: boolean
  concurrent: number;
  desc: string;
  desensitize: boolean;
  sites: number;
  seats: number;
  sso: boolean;
  statistics: boolean;
  support_phone: boolean;
  support_wechat: boolean;
  remove_powered_by: boolean;
  theme: 5 | 10 | 99;
  expires_at?: string;
  created_at?: string;
  updated_at?: string;
}

@Component({
  selector: "app-enterprise-settings-plan",
  templateUrl: "./plan.component.html",
  styleUrls: ["./plan.component.less"],
})

export class ProEnterpriseSettingsPlanComponent implements OnInit {
  count = 4;
  array = new Array(this.count);
  plan: Plan;
  plans_available: Plan[];
  plans: Plan[] = [];

  constructor(
    private http: _HttpClient,
    private msg: NzMessageService
  ) { }

  ngOnInit(): void {
    this.http.get(`api/enterprise/plan`).subscribe((res: { success: boolean, message?: string, data: { plan: Plan, plans_available: Plan[] } }) => {
      if (!res.success) {
        this.msg.error(res.message);
        return;
      }

      this.plan = res.data.plan;
      this.plans_available = res.data.plans_available;
      this.plans = [res.data.plan].concat(res.data.plans_available);
    });
  }
}
