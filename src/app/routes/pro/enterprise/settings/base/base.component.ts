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
})
export class ProEnterpriseSettingsBaseComponent implements OnInit {
  constructor(
    private http: _HttpClient,
    private msg: NzMessageService
  ) { }
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
      }
    );
  }

  choProvince(parent_id: string, cleanCity: boolean = true, callback?: () => void): void {
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
        if (callback) {
          callback();
        }
      });
  }

  choCity(parent_id: string, cleanCity: boolean = true, callback?: () => void): void {
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
        if (callback) {
          callback();
        }
      });
  }

  choArea(parent_id: string, cleanCity: boolean = true, callback?: () => void): void {
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
        if (callback) {
          callback();
        }
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
    setTimeout(() => {
      const name = (evt.target as HTMLInputElement).value;
      if (!name || !name.length) {
        return;
      }

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
    }, 100);
  }

  autoFill(option: NzAutocompleteOptionComponent): void {
    this.enterpriseLoading = true;
    const pid = option.nzValue.pid;
    this.http
      .get(`api/enterprise/name-suggest-detail`, { pid })
      .subscribe(
        (res: {
          success: boolean;
          message?: string;
          data: {
            dataInfo: any;
            regAddr: string;
            telephone: string;
            province_code: string;
            city_code: string;
            area_code: string;
            street_code: string;
          };
        }) => {
          if (!res.success) {
            this.msg.error(res.message);
            return;
          }

          this.enterprise.name = option.nzValue.resultStr;
          this.enterprise.serial = res.data.dataInfo.basic.regNo;
          this.enterprise.address = res.data.regAddr;
          this.enterprise.phone = res.data.telephone;
          if (res.data.province_code) {
            this.enterprise.geographic.province = {
              key: res.data.province_code,
            };
            this.choProvince(res.data.province_code, false, () => {
              if (res.data.city_code) {
                this.enterprise.geographic.city = {
                  key: res.data.city_code,
                };
                this.choCity(res.data.city_code, false, () => {
                  if (res.data.area_code) {
                    this.enterprise.geographic.area = {
                      key: res.data.area_code,
                    };
                    this.choArea(res.data.area_code, false, () => {
                      if (res.data.street_code) {
                        this.enterprise.geographic.street = {
                          key: res.data.street_code,
                        };
                      }
                    })
                  }
                })
              }
            })
          }
          this.enterpriseLoading = false;
        },
        (err: { error: { message: string } }) => {
          this.msg.error(err.error.message);
          this.enterpriseLoading = false;
        }
      );
  }
}
