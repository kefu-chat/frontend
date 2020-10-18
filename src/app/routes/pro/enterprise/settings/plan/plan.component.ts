import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { _HttpClient } from "@delon/theme";
import { NzMessageService } from "ng-zorro-antd/message";

export interface Plan {
  id: string;
  name: string;
  price_monthly: null | number;
  price_annually: null | number;
  price_biennially: null | number;
  price_triennially: null | number;
  available: boolean;
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

export const STATUS_UNPAID = 0;
export const STATUS_PAID = 1;
export const STATUS_CANCELLED = -1;

export interface Order {
  id: string;
  enterprise_id: string;
  plan_id: string;
  user_id: string;
  period: "monthly" | "annually" | "biennially" | "triennially";
  coupon_id: null | string;
  price: number;
  need_pay_price: number;
  paid_price: null | number;
  status: 0 | 1 | -1;
  created_at?: string;
  updated_at?: string;
  plan: Plan;
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
  selectedPlan: Plan | null = null;
  periodsList: string[] = ["monthly", "annually", "biennially", "triennially"];
  upgradeForm: FormGroup;
  orders: Order[] = [];
  ordersTotal: number;
  per_page = 5;
  ordersLoading: boolean;
  STATUS_UNPAID = STATUS_UNPAID;
  STATUS_PAID = STATUS_PAID;
  STATUS_CANCELLED = STATUS_CANCELLED;

  constructor(
    private http: _HttpClient,
    private msg: NzMessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.orderList(1);
    this.loadPlan();
  }

  select(plan_id: string): void {
    this.selectedPlan = this.plans.filter((plan) => plan.id === plan_id)[0];
    this.upgradeForm = this.fb.group({
      period: "annually",
    });
  }

  unselect(): void {
    this.selectedPlan = null;
  }

  upgrade(): void {
    this.http
      .post(
        `api/enterprise/plan/upgrade/${this.selectedPlan.id}`,
        this.upgradeForm.getRawValue()
      )
      .subscribe(
        (res: {
          success: boolean;
          message?: string;
          data: { order: Order };
        }) => {
          this.orders.unshift(res.data.order);
          this.unselect();
        }
      );
  }

  loadPlan(): void {
    this.http
      .get(`api/enterprise/plan`)
      .subscribe(
        (res: {
          success: boolean;
          message?: string;
          data: { plan: Plan; plans_available: Plan[] };
        }) => {
          if (!res.success) {
            this.msg.error(res.message);
            return;
          }

          this.plan = res.data.plan;
          this.plans_available = res.data.plans_available;
          this.plans = [res.data.plan].concat(res.data.plans_available);
        }
      );
  }

  orderList(page: null | number): void {
    this.ordersLoading = true;
    this.http
      .get(`api/enterprise/plan/upgrade/order/list`, {
        per_page: this.per_page,
        page,
      })
      .subscribe(
        (res: {
          success: boolean;
          message?: string;
          data: { list: { data: Order[]; total: number } };
        }) => {
          this.orders = res.data.list.data;
          this.ordersTotal = res.data.list.total;
          this.ordersLoading = false;
          console.log(this.ordersTotal);
        }
      );
  }

  cancel(order: Order): void {
    this.http
      .post(
        `api/enterprise/plan/upgrade/${order.id}/cancel`
      )
      .subscribe(
        (res: {
          success: boolean;
          message?: string;
          data: { order: Order };
        }) => {
          this.orders.filter(o => o.id === order.id)[0].status = STATUS_CANCELLED;
        }
      );
  }
}
