import { Component, OnInit, ChangeDetectorRef} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { _HttpClient } from "@delon/theme";
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
    private cdr: ChangeDetectorRef
  ) {}

  websites: Website[] = [];
  employees: User[] = [];
  loading = false;
  institutionId: string;

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
    this.institutionId = siteId;
    this.websites.forEach((site) => (site.expand = false));

    const sites = this.websites.filter((site) => site.id === siteId);
    if (!sites.length) {
      this.msg.error(`没有找到${siteId}的网站`);
      return;
    }

    sites[0].expand = true;

    this.http
      .get(`api/institution/${siteId}/employee/list`, {per_page: 9999, ...query})
      .subscribe((res: { data: { list: { data: User[] } } }) => {
        this.employees = res.data.list.data;
        this.cdr.markForCheck();
      });

    return;
  }

  expand(website: Website): boolean {
    if (website.expand) {
      this.cdr.markForCheck();
      return true;
    }
    this.loadEmployeeList(website.id);
    this.cdr.markForCheck();
    return true;
  }

  updateWebsite(website: Website): void {
    this.drawerWebsite = true;
    this.drawerWebsiteAction = "update";
    this.drawerWebsiteData = website;
    this.drawerWebsiteForm = this.fb.group(this.drawerWebsiteData);
    this.cdr.markForCheck();
  }

  updateEmployee(user: User): void {
    this.drawerEmployee = true;
    this.drawerEmployeeAction = "update";
    this.drawerEmployeeData = user;
    this.drawerEmployeeForm = this.fb.group(this.drawerEmployeeData);
    this.cdr.markForCheck();
  }

  getCode(website: Website): void {
    this.drawerCode = true;
    this.drawerCodeData = website;
    this.cdr.markForCheck();
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
    this.cdr.markForCheck();
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
    this.cdr.markForCheck();
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
    let url = `api/institution/create`;
    if (this.drawerWebsiteAction == `update`) {
      url = `api/institution/${this.drawerWebsiteData.id}/update`;
    }

    this.http
      .post(url, this.drawerWebsiteForm.getRawValue())
      .subscribe((res: { data: { institution: Website } }) => {
        this.drawerWebsiteData = res.data.institution;
        this.drawerWebsiteForm = this.fb.group(this.drawerWebsiteData);

        if (this.drawerWebsiteAction === 'update') {
          try {
            this.websites.filter(w => w.id === res.data.institution.id)[0] = res.data.institution;
          } catch (e) {
            console.error(e);
          }
        } else {
          this.websites.unshift(this.drawerWebsiteData);
        }

        this.cdr.markForCheck();
        this.msg.success('成功!');
      });
  }

  submitEmployeeForm(): void {
    let url = `api/institution/${this.institutionId}/employee/create`;
    if (this.drawerEmployeeAction == `update`) {
      url = `api/institution/${this.institutionId}/employee/${this.drawerEmployeeData.id}/update`;
    }

    this.http
      .post(url, this.drawerEmployeeForm.getRawValue())
      .subscribe((res: { data: { employee: User } }) => {
        this.drawerEmployeeData = res.data.employee;
        this.drawerEmployeeForm = this.fb.group(this.drawerEmployeeData);

        if (this.drawerEmployeeAction === 'update') {
          try {
            this.employees.filter(e => e.id === res.data.employee.id)[0] = res.data.employee;
          } catch (e) {
            console.error(e);
          }
        } else {
          this.employees.push(res.data.employee);
        }

        this.cdr.markForCheck();
        this.msg.success("成功!");
      });
  }
}
