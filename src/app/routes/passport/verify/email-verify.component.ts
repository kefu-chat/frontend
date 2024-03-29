import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { _HttpClient } from "@delon/theme";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
  selector: "passport-lock",
  templateUrl: "./email-verify.component.html",
  styleUrls: ["./email-verify.component.less"],
})
export class EmailVerifyComponent implements OnInit {
  f: FormGroup;
  success = false;

  constructor(
    fb: FormBuilder,
    private router: Router,
    public http: _HttpClient,
    private msg: NzMessageService
  ) {
    this.f = fb.group({
      email: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.submit();
  }

  submit(): void {
    this.http
      .post(
        "api/" +
          location.href.split(location.origin + "/")[1] +
          "&_allow_anonymous=true"
      )
      .subscribe(
        (res: { status?: string; message?: string; success?: boolean }) => {
          if (res.status && res.status == "verification.verified") {
            this.msg.success("验证成功！请登录");
            this.success = true;

            setTimeout(() => {
              this.router.navigateByUrl("conversation/chat");
            }, 1000);
            return;
          }
          this.msg.error(res.message);
        },
        (err: { error: { status?: string }; statusText: string }) => {
          if (err.error && err.error.status) {
            this.msg.error(err.error.status);
            return;
          }
          this.msg.error(err.statusText);
        }
      );
  }
}
