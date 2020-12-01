import { Component, OnInit, TemplateRef } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzModalService } from 'ng-zorro-antd/modal';
import { QRModule } from '@delon/abc/qr';

@Component({
  selector: "app-account-settings-binding",
  templateUrl: "./binding.component.html",
})
export class ProAccountSettingsBindingComponent implements OnInit {
  bindSrc: string;
  loading = false;
  bindings = [];

  constructor(
    public msg: NzMessageService,
    private modal: NzModalService,
    private http: _HttpClient
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.http.get(`api/security/binding`).subscribe((res: {success: boolean, message?: string, data?: {list: string[]}}) => {
      if (!res.success) {
        this.msg.error(res.message);
        return;
      }

      this.loading = false;
      this.bindings = res.data.list;      
    }, () => {
      this.loading = false;
    });
  }

  bind(type: `wechat` | `wecom` | `dingtalk`, qrCode: TemplateRef<{}>): void {
    this.loading = true;
    this.http.get(`api/security/binding/${type}`).subscribe((res: {success: boolean, message?: string, data?: {qr: string}}) => {
      if (!res.success) {
        this.msg.error(res.message);
        return;
      }

      this.loading = false;
      this.bindSrc = res.data.qr;
      this.modal.create({
        nzContent: qrCode,
        nzTitle: `请扫码绑定`,
      });
    }, () => {
      this.loading = false;
    });
  }

  unbind(type: `wechat` | `wecom` | `dingtalk`): void {
    this.loading = true;
    this.http.post(`api/security/binding/${type}/unbind`).subscribe((res: {success: boolean, message?: string, data?: {qr: string}}) => {
      if (!res.success) {
        this.msg.error(res.message);
        return;
      }

      this.loading = false;
      this.ngOnInit();
    }, () => {
      this.loading = false;
    });
  }

}
