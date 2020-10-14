import { Component, OnInit, ChangeDetectorRef} from "@angular/core";
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
  constructor(public msg: NzMessageService, private http: _HttpClient, private cdr: ChangeDetectorRef) {}

  websites: Website[] = [];
  employees: User[] = [];
  loading:boolean = false;

  ngOnInit(): void {
    this.loadInstitutionList();
  }

  loadInstitutionList(query?: { page?: number; per_page?: number }): void {
    this.loading = true;
    this.http
      .get(`api/institution/list`, query)
      .subscribe((res: { data: { list: { data: Website[] } } }) => {
        this.loading = false;
        setTimeout(()=>{
          this.websites = res.data.list.data;
          if (this.websites.length) {
            this.loadEmployeeList(this.websites[0].id);
          }
        })
        
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
        this.cdr.markForCheck()
      });

    return;
  }

  expand(website: Website): boolean {
    if (website.expand) {
      return true;
    }
    this.loadEmployeeList(website.id);
    return true;
  }

  trackBy(website: Website): string {
    console.log(website)
    return website.id;
  }
}
