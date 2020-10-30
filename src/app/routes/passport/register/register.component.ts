import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from "@angular/router";
import { _HttpClient } from "@delon/theme";
import { NzMessageService } from "ng-zorro-antd/message";

export interface CaptchaChallengeResponse {
  captcha_image: SafeResourceUrl;
  captcha_challenge: string;
};
@Component({
  selector: "passport-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.less"],
})
export class UserRegisterComponent implements OnDestroy, OnInit {
  constructor(
    fb: FormBuilder,
    private router: Router,
    public http: _HttpClient,
    public msg: NzMessageService,
    private sanitizer: DomSanitizer
  ) {
    this.form = fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [
        null,
        [
          Validators.required,
          Validators.minLength(6),
          UserRegisterComponent.checkPassword.bind(this),
        ],
      ],
      password_confirmation: [
        null,
        [
          Validators.required,
          Validators.minLength(6),
          UserRegisterComponent.passwordEquar,
        ],
      ],
      captcha_answer: [
        null,
        [
          Validators.required,
          Validators.minLength(4),
        ],
      ],
      captcha_challenge: [
        null,
        [
          Validators.required,
          Validators.minLength(6),
        ],
      ],
      //mobilePrefix: ['+86'],
      //mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      //captcha: [null, [Validators.required]],
    });
  }

  // #region fields

  get mail(): AbstractControl {
    return this.form.controls.mail;
  }
  get password(): AbstractControl {
    return this.form.controls.password;
  }
  get confirm(): AbstractControl {
    return this.form.controls.confirm;
  }
  get mobile(): AbstractControl {
    return this.form.controls.mobile;
  }
  form: FormGroup;
  error = "";
  type = 0;
  visible = false;
  status = "pool";
  progress = 0;
  passwordProgressMap = {
    ok: "success",
    pass: "normal",
    pool: "exception",
  };
  captcha: CaptchaChallengeResponse;

  // #endregion

  // #region get captcha

  count = 0;
  interval$: any;

  ngOnInit(): void {
    this.getCaptcha();
  }

  static checkPassword(control: FormControl): void {
    if (!control) {
      return null;
    }
    const self: any = this;
    self.visible = !!control.value;
    if (control.value && control.value.length > 9) {
      self.status = "ok";
    } else if (control.value && control.value.length > 5) {
      self.status = "pass";
    } else {
      self.status = "pool";
    }

    if (self.visible) {
      self.progress =
        control.value.length * 10 > 100 ? 100 : control.value.length * 10;
    }
  }

  static passwordEquar(control: FormControl): { equar: boolean } | null {
    if (!control || !control.parent) {
      return null;
    }
    if (control.value !== control.parent.get("password").value) {
      return { equar: true };
    }
    return null;
  }

  getCaptcha(): void {
    this.http.post(`api/captcha?_allow_anonymous=true`).subscribe((res: { data: {captcha_challenge: string, captcha_image: string} }) => {
      this.captcha = {
        captcha_challenge: res.data.captcha_challenge,
        captcha_image: this.xss(res.data.captcha_image),
      };
      this.form.get('captcha_challenge').setValue(res.data.captcha_challenge);
    });
  }

  // #endregion

  submit(): void {
    this.error = "";
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    });
    if (this.form.invalid) {
      return;
    }

    const data = this.form.value;

    console.timeLog(data)
    this.http.post("api/register?_allow_anonymous=true", data).subscribe(() => {
      this.router.navigateByUrl("/register-result", {
        queryParams: { email: data.email },
      });
    });
  }

  xss(src: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(src);
  }

  ngOnDestroy(): void {
    if (this.interval$) {
      clearInterval(this.interval$);
    }
  }
}
