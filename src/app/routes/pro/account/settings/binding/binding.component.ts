import { Component, TemplateRef } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzModalService } from 'ng-zorro-antd/modal';
import { QRModule } from '@delon/abc/qr';

@Component({
  selector: "app-account-settings-binding",
  templateUrl: "./binding.component.html",
})
export class ProAccountSettingsBindingComponent {
  bindSrc: string;
  loading = false;

  constructor(
    public msg: NzMessageService,
    private modal: NzModalService,
    private http: _HttpClient
  ) {}

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
}
