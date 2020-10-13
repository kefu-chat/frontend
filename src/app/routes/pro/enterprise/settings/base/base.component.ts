import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { NzMessageService } from "ng-zorro-antd/message";
import { zip } from "rxjs";

interface ProEnterpriseSettingsUser {
  name: string;
  profile: string;
  country: string;
  address: string;
  phone: string;
  geographic: {
    province: {
      key: string;
    };
    city: {
      key: string;
    };
  };
}

interface ProEnterpriseSettingsCity {
  name: string;
  id: string;
}

@Component({
  selector: "app-enterprise-settings-base",
  templateUrl: "./base.component.html",
  styleUrls: ["./base.component.less"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProEnterpriseSettingsBaseComponent implements OnInit {
  constructor(
    private http: _HttpClient,
    private cdr: ChangeDetectorRef,
    private msg: NzMessageService
  ) {}
  avatar = "";
  enterpriseLoading = true;
  enterprise: ProEnterpriseSettingsUser;

  // #region geo

  provinces: ProEnterpriseSettingsCity[] = [];
  cities: ProEnterpriseSettingsCity[] = [];

  ngOnInit(): void {
    zip(
      this.http.get(`api/enterprise`),
      this.http.get("/geo/province")
    ).subscribe(
      ([enterpriseRes, province]: [
        { data: { enterprise: any } },
        ProEnterpriseSettingsCity[]
      ]) => {
        this.enterpriseLoading = false;
        this.enterprise = enterpriseRes.data.enterprise;
        this.provinces = province;
        if (
          enterpriseRes.data.enterprise.geographic &&
          enterpriseRes.data.enterprise.geographic.province
        ) {
          this.choProvince(
            enterpriseRes.data.enterprise.geographic.province.key,
            false
          );
        }
        this.cdr.detectChanges();
      }
    );
  }

  choProvince(pid: string, cleanCity: boolean = true): void {
    this.http.get(`/geo/${pid}`).subscribe((res) => {
      this.cities = res;
      if (cleanCity) {
        this.enterprise.geographic.city.key = "";
      }
      this.cdr.detectChanges();
    });
  }

  // #endregion

  save(): boolean {
    this.msg.success(JSON.stringify(this.enterprise));
    return false;
  }
}
