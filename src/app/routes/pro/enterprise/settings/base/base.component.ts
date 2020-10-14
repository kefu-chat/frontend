import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { NzAutocompleteOptionComponent } from 'ng-zorro-antd/auto-complete';
import { NzMessageService } from "ng-zorro-antd/message";
import { zip } from "rxjs";
import { Enterprise } from "../../../../../model/application/conversation.interface";

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
  enterprise: Enterprise;

  // #region geo

  provinces: ProEnterpriseSettingsCity[] = [];
  cities: ProEnterpriseSettingsCity[] = [];
  areas: ProEnterpriseSettingsCity[] = [];
  streets: ProEnterpriseSettingsCity[] = [];
  enterpriseSuggestion: any[] = [];

  ngOnInit(): void {
    zip(
      this.http.get(`api/enterprise`),
      this.http.get(`api/location/list`)
    ).subscribe(
      ([enterpriseRes, province]: [
        { data: { enterprise: any } },
        { data: { list: ProEnterpriseSettingsCity[] } }
      ]) => {
        this.enterpriseLoading = false;
        this.enterprise = enterpriseRes.data.enterprise;
        this.provinces = province.data.list;
        if (
          enterpriseRes.data.enterprise.geographic &&
          enterpriseRes.data.enterprise.geographic.province
        ) {
          this.choProvince(
            enterpriseRes.data.enterprise.geographic.province.key,
            false
          );

          if (
            enterpriseRes.data.enterprise.geographic &&
            enterpriseRes.data.enterprise.geographic.city
          ) {
            this.choCity(
              enterpriseRes.data.enterprise.geographic.city.key,
              false
            );

            if (
              enterpriseRes.data.enterprise.geographic &&
              enterpriseRes.data.enterprise.geographic.area
            ) {
              this.choArea(
                enterpriseRes.data.enterprise.geographic.area.key,
                false
              );
            }
          }
        }
        this.cdr.detectChanges();
      }
    );
  }

  choProvince(parent_id: string, cleanCity: boolean = true): void {
    this.http
      .get(`api/location/list`, { parent_id })
      .subscribe((res: { data: { list: ProEnterpriseSettingsCity[] } }) => {
        this.cities = res.data.list;
        if (!this.enterprise.geographic.city) {
          this.enterprise.geographic.city = { key: "" };
        }
        if (cleanCity) {
          this.enterprise.geographic.city.key = "";
        }
        this.cdr.detectChanges();
      });
  }

  choCity(parent_id: string, cleanCity: boolean = true): void {
    this.http
      .get(`api/location/list`, { parent_id })
      .subscribe((res: { data: { list: ProEnterpriseSettingsCity[] } }) => {
        this.areas = res.data.list;
        if (!this.enterprise.geographic.area) {
          this.enterprise.geographic.area = { key: "" };
        }
        if (cleanCity) {
          this.enterprise.geographic.area.key = "";
        }
        this.cdr.detectChanges();
      });
  }

  choArea(parent_id: string, cleanCity: boolean = true): void {
    this.http
      .get(`api/location/list`, { parent_id })
      .subscribe((res: { data: { list: ProEnterpriseSettingsCity[] } }) => {
        this.streets = res.data.list;
        if (!this.enterprise.geographic.street) {
          this.enterprise.geographic.street = { key: "" };
        }
        if (cleanCity) {
          this.enterprise.geographic.street.key = "";
        }
        this.cdr.detectChanges();
      });
  }

  save(): boolean {
    this.http
      .post(`api/enterprise/update`, this.enterprise)
      .subscribe((res: { success: boolean; message?: string }) => {
        if (!res.success) {
          this.msg.error(res.message);
          return;
        }

        this.msg.success("保存成功");
      });
    return false;
  }

  search(evt: KeyboardEvent): void {
    const name = (evt.target as HTMLInputElement).value;
    this.http
      .get(`api/enterprise/name-suggest`, { name })
      .subscribe(
        (res: {
          success: boolean;
          message?: string;
          data: { list: any[] };
        }) => {
          if (!res.success) {
            this.msg.error(res.message);
            return;
          }

          this.enterpriseSuggestion = res.data.list;
        }
      );
  }

  autoFill(option: NzAutocompleteOptionComponent): void {
    const pid = option.nzValue.pid;
    this.http
      .get(`api/enterprise/name-suggest-detail`, { pid })
      .subscribe(
        (res: {
          success: boolean;
          message?: string;
          data: { dataInfo: any; regAddr: string; telephone: string; };
        }) => {
          if (!res.success) {
            this.msg.error(res.message);
            return;
          }

          this.enterprise.serial = res.data.dataInfo.basic.regNo;
          this.enterprise.address = res.data.regAddr;
          this.enterprise.phone = res.data.telephone;

          this.cdr.detectChanges();
        }
      );
  }
}
