import { Component, OnInit, ChangeDetectorRef} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SettingsService, _HttpClient } from "@delon/theme";
import { User as SettingUser } from '@delon/theme/src/services/settings/interface'
import { NzMessageService } from "ng-zorro-antd/message";
import {
  User,
  Website,
} from "../../../../../model/application/conversation.interface";

@Component({
  selector: "app-enterprise-settings-structure",
  templateUrl: "./structure.component.html",
})
export class ProEnterpriseSettingsStructureComponent implements OnInit {
  constructor(
    public msg: NzMessageService,
    private http: _HttpClient,
    private fb: FormBuilder,
    private settings: SettingsService,
  ) {}

  websites: Website[] = [];
  employees: User[] = [];
  loading = false;

  drawerWebsite = false;
  drawerEmployee = false;
  drawerCode = false;
  drawerWebsiteAction: "update" | "create";
  drawerEmployeeAction: "update" | "create";
  drawerWebsiteData: Website;
  drawerEmployeeData: User;
  drawerCodeData: Website;
  drawerWebsiteForm: FormGroup;
  drawerEmployeeForm: FormGroup;

  get user(): User|SettingUser {
    return this.settings.user;
  }

  ngOnInit(): void {
    this.loadInstitutionList();
  }

  loadInstitutionList(query?: { page?: number; per_page?: number }): void {
    this.loading = true;
    this.http
      .get(`api/institution/list`, query)
      .subscribe((res: { data: { list: { data: Website[] } } }) => {
        this.loading = false;
        this.websites = res.data.list.data;
        if (this.websites.length) {
          this.loadEmployeeList(this.websites[0].id);
        }
      });
  }

  loadEmployeeList(
    siteId: string,
    query?: { page?: number; per_page?: number }
  ): void {
    this.websites.forEach((site) => (site.expand = false));

    const sites = this.websites.filter((site) => site.id === siteId);
    if (!sites.length) {
      this.msg.error(`没有找到${siteId}的网站`);
      return;
    }

    sites[0].expand = true;

    this.http
      .get(`api/institution/${siteId}/employee/list`, query)
      .subscribe((res: { data: { list: { data: User[] } } }) => {
        this.employees = res.data.list.data;
      });

    return;
  }

  expand(website: Website, expand: boolean): void {
    website.expand = expand;
    if (website.expand) {
      this.loadEmployeeList(website.id);
    }
    return;
  }

  updateWebsite(website: Website): void {
    this.drawerWebsite = true;
    this.drawerWebsiteAction = "update";
    this.drawerWebsiteData = website;
    this.drawerWebsiteForm = this.fb.group(this.drawerWebsiteData);
  }

  updateEmployee(user: User): void {
    this.drawerEmployee = true;
    this.drawerEmployeeAction = "update";
    this.drawerEmployeeData = user;
    this.drawerEmployeeForm = this.fb.group(this.drawerEmployeeData);
  }

  getCode(website: Website): void {
    this.drawerCode = true;
    this.drawerCodeData = website;
  }

  createWebsite(): void {
    this.drawerWebsite = true;
    this.drawerWebsiteAction = "create";
    this.drawerWebsiteData = {
      id: "",
      name: "",
      website: "",
      terminate_manual: "",
      created_at: "",
      updated_at: "",
      billing_name: "",
      billing_phone: "",
      technical_name: "",
      technical_phone: "",
      terminate_timeout: "",
      greeting_message: "",
    };
    this.drawerWebsiteForm = this.fb.group(this.drawerWebsiteData);
  }

  createEmployee(): void {
    this.drawerEmployee = true;
    this.drawerEmployeeAction = "create";
    this.drawerEmployeeData = {
      id: "",
      institution_id: "",
      name: "",
      email: "",
      email_verified_at: "",
      created_at: "",
      updated_at: "",
      deleted_at: "",
      avatar: "",
    };
    this.drawerEmployeeForm = this.fb.group(this.drawerEmployeeData);
  }

  drawerWebsiteClose(): void {
    this.drawerWebsite = false;
  }

  drawerEmployeeClose(): void {
    this.drawerEmployee = false;
  }

  drawerCodeClose(): void {
    this.drawerCode = false;
  }

  submitWebsiteForm(): void {
    // @todo:
  }

  submitEmployeeForm(): void {
    // @todo:
  }

  deactivateEmployee(website: Website, employee: User): void {
    this.http
      .post(`api/institution/${website.id}/employee/${employee.id}/deactivate`)
      .subscribe((res: { data: { } }) => {
        employee.deleted_at = (new Date).toISOString();
        this.employees.filter(e => e.id === employee.id)[0] = employee;
      }, (err: {error: {success: boolean; message: string}}) => {
        this.msg.error(err.error.message);
      });
  }

  activateEmployee(website: Website, employee: User): void {
    this.http
      .post(`api/institution/${website.id}/employee/${employee.id}/activate`)
      .subscribe((res: { data: { } }) => {
        employee.deleted_at = null;
        this.employees.filter(e => e.id === employee.id)[0] = employee;
      }, (err: {error: {success: boolean; message: string}}) => {
        this.msg.error(err.error.message);
      });
  }
}
