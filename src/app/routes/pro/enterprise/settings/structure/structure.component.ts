import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SettingsService, _HttpClient } from "@delon/theme";
import { User as SettingUser } from "@delon/theme/src/services/settings/interface";
import { NzMessageService } from "ng-zorro-antd/message";
import {
  User,
  UserWithPassword,
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
    private settings: SettingsService
  ) {}

  websites: Website[] = [];
  employees: User[] = [];
  loading = false;
  institutionId: string;

  drawerWebsite = false;
  drawerEmployee = false;
  drawerCode = false;
  drawerPassword = false;
  drawerWebsiteAction: "update" | "create";
  drawerEmployeeAction: "update" | "create";
  drawerWebsiteData: Website;
  drawerEmployeeData: User;
  drawerPasswordData: UserWithPassword;
  drawerCodeData: Website;
  drawerWebsiteForm: FormGroup;
  drawerEmployeeForm: FormGroup;
  drawerPasswordForm: FormGroup;

  get user(): SettingUser | User {
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
    this.institutionId = siteId;
    this.websites.forEach((site) => (site.expand = false));

    const sites = this.websites.filter((site) => site.id === siteId);
    if (!sites.length) {
      this.msg.error(`没有找到${siteId}的网站`);
      return;
    }

    sites[0].expand = true;

    this.http
      .get(`api/institution/${siteId}/employee/list`, {
        per_page: 9999,
        ...query,
      })
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
    this.drawerWebsiteForm = this.fb.group({
      ...this.drawerWebsiteData,
      name: [website.name, [Validators.required]],
      website: [website.website, [Validators.required]],
      terminate_manual: [website.terminate_manual, [Validators.required]],
      terminate_timeout: [website.terminate_timeout, [Validators.required]],
      greeting_message: [website.greeting_message, [Validators.required]],
      theme: [website.theme, [Validators.required]],
      timeout: [website.timeout, [Validators.required]],
    });
  }

  updateEmployee(user: User): void {
    this.drawerEmployee = true;
    this.drawerEmployeeAction = "update";
    this.drawerEmployeeData = user;
    this.drawerEmployeeForm = this.fb.group({
      name: [user.name, [Validators.required]],
      email: [user.email, [Validators.required, Validators.email]],
      title: [user.title, [Validators.required]],
    });
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
      theme: "blue1",
      timeout: 900,
    };
    this.drawerWebsiteForm = this.fb.group({
      ...this.drawerWebsiteData,
      name: [null, [Validators.required]],
      website: ["", [Validators.required]],
      terminate_manual: ["", [Validators.required]],
      terminate_timeout: ["", [Validators.required]],
      greeting_message: ["", [Validators.required]],
      theme: ["blue1", [Validators.required]],
      timeout: [900, [Validators.required]],
    });
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
    this.drawerEmployeeForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      title: [null, [Validators.required]],
    });
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

  drawerPasswordClose(): void {
    this.drawerPassword = false;
  }

  submitWebsiteForm(): void {
    Object.keys(this.drawerWebsiteForm.controls).forEach((key) => {
      this.drawerWebsiteForm.controls[key].markAsDirty();
      this.drawerWebsiteForm.controls[key].updateValueAndValidity();
    });
    if (this.drawerWebsiteForm.invalid) {
      return;
    }

    let url = `api/institution/create`;
    if (this.drawerWebsiteAction == `update`) {
      url = `api/institution/${this.drawerWebsiteData.id}/update`;
    }

    this.http
      .post(url, this.drawerWebsiteForm.getRawValue())
      .subscribe((res: { data: { institution: Website } }) => {
        this.drawerWebsiteData = res.data.institution;
        this.drawerWebsiteForm = this.fb.group(this.drawerWebsiteData);

        if (this.drawerWebsiteAction === "update") {
          try {
            this.websites.filter((w) => w.id === res.data.institution.id)[0] =
              res.data.institution;
          } catch (e) {
            console.error(e);
          }
        } else {
          this.websites.unshift(this.drawerWebsiteData);
        }

        this.msg.success("成功!");
      });
  }

  submitEmployeeForm(): void {
    Object.keys(this.drawerEmployeeForm.controls).forEach((key) => {
      this.drawerEmployeeForm.controls[key].markAsDirty();
      this.drawerEmployeeForm.controls[key].updateValueAndValidity();
    });
    if (this.drawerEmployeeForm.invalid) {
      return;
    }

    let url = `api/institution/${this.institutionId}/employee/create`;
    if (this.drawerEmployeeAction == `update`) {
      url = `api/institution/${this.institutionId}/employee/${this.drawerEmployeeData.id}/update`;
    }

    this.http
      .post(url, this.drawerEmployeeForm.getRawValue())
      .subscribe((res: { data: { employee: User } }) => {
        this.drawerEmployeeData = res.data.employee;
        this.drawerEmployeeForm = this.fb.group(this.drawerEmployeeData);

        if (this.drawerEmployeeAction === "update") {
          try {
            this.employees.filter((e) => e.id === res.data.employee.id)[0] =
              res.data.employee;
          } catch (e) {
            console.error(e);
          }
        } else {
          this.employees.push(res.data.employee);
        }

        this.msg.success("成功!");
      });
  }

  deactivateEmployee(website: Website, employee: User): void {
    this.http
      .post(`api/institution/${website.id}/employee/${employee.id}/deactivate`)
      .subscribe(
        (res: { data: {} }) => {
          employee.deleted_at = new Date().toISOString();
          this.employees.filter((e) => e.id === employee.id)[0] = employee;
          this.msg.success("已禁用!");
        },
        (err: { error: { success: boolean; message: string } }) => {
          this.msg.error(err.error.message);
        }
      );
  }

  activateEmployee(website: Website, employee: User): void {
    this.http
      .post(`api/institution/${website.id}/employee/${employee.id}/activate`)
      .subscribe(
        (res: { data: {} }) => {
          employee.deleted_at = null;
          this.employees.filter((e) => e.id === employee.id)[0] = employee;
          this.msg.success("已启用!");
        },
        (err: { error: { success: boolean; message: string } }) => {
          this.msg.error(err.error.message);
        }
      );
  }

  updateEmployeePassword(website: Website, employee: User): void {
    this.drawerPassword = true;
    this.drawerPasswordData = {
      ...employee,
      institution_id: website.id,
      password: null,
      password_confirmation: null,
    };
    this.drawerPasswordForm = this.fb.group(this.drawerPasswordData);
  }

  submitPasswordForm(): void {
    this.http
      .post(
        `api/institution/${this.drawerPasswordData.institution_id}/employee/${this.drawerPasswordData.id}/change-password`,
        this.drawerPasswordForm.getRawValue()
      )
      .subscribe(
        (res: { success: boolean; message: string }) => {
          if (res.success) {
            this.msg.success("修改成功!");
          } else {
            this.msg.error(res.message);
          }
        },
        (err: { error: { success: boolean; message: string } }) => {
          this.msg.error(err.error.message);
        }
      );
  }

  changePermission(employee: User, permission: "support" | "manager"): void {
    this.http
      .post(
        `api/institution/${this.institutionId}/employee/${employee.id}/change-permission`,
        { permission }
      )
      .subscribe(
        (res: { success: boolean; message: string; data: {employee: User} }) => {
          if (res.success) {
            this.msg.success("修改成功!");
            this.employees.filter((u) => u.id === employee.id)[0].permissions =
              res.data.employee.permissions;
          } else {
            this.msg.error(res.message);
          }
        },
        (err: { error: { success: boolean; message: string } }) => {
          this.msg.error(err.error.message);
        }
      );
  }
}
