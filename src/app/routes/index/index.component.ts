import { Component } from "@angular/core";
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';
import { _HttpClient } from "@delon/theme";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["../../layout/front/front.component.css"],
})
export class IndexComponent {
  constructor(
    private http: _HttpClient,
    public router: Router,
    private deviceService: DeviceDetectorService
  ) {
  }

  toLogin() {
    const isMobile = this.deviceService.isMobile();
    if (isMobile) {
      location.href = '//h5.kefu.chat';
    } else {
      this.router.navigateByUrl('/login');
    }
    return;
  }
}
