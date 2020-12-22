import { Component } from "@angular/core";
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';
import { _HttpClient } from "@delon/theme";

@Component({
  selector: "app-front",
  templateUrl: "./front.component.html",
  styleUrls: ["./front.component.css", ],
})
export class LayoutFrontComponent {
  constructor(
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
