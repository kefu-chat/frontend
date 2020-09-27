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
  email: string;
  name: string;
  profile: string;
  country: string;
  address: string;
  phone: string;
  avatar: string;
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
  userLoading = true;
  user: ProEnterpriseSettingsUser;

  // #region geo

  provinces: ProEnterpriseSettingsCity[] = [];
  cities: ProEnterpriseSettingsCity[] = [];

  ngOnInit(): void {
    zip(
      this.http.get("/user/current"),
      this.http.get("/geo/province")
    ).subscribe(
      ([user, province]: [
        ProEnterpriseSettingsUser,
        ProEnterpriseSettingsCity[]
      ]) => {
        this.userLoading = false;
        this.user = user;
        this.provinces = province;
        this.choProvince(user.geographic.province.key, false);
        this.cdr.detectChanges();
      }
    );
  }

  choProvince(pid: string, cleanCity: boolean = true): void {
    this.http.get(`/geo/${pid}`).subscribe((res) => {
      this.cities = res;
      if (cleanCity) {
        this.user.geographic.city.key = "";
      }
      this.cdr.detectChanges();
    });
  }

  // #endregion

  save(): boolean {
    this.msg.success(JSON.stringify(this.user));
    return false;
  }
}
