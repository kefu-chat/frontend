import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, SecurityContext, ViewChild } from "@angular/core";

import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { _HttpClient } from "@delon/theme";
import { NzMessageService } from "ng-zorro-antd/message";

export interface CaptchaChallengeResponse {
  captcha_image: string;
  captcha_challenge: string;
}

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
    public msg: NzMessageService
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
      captcha_answer: [null, [Validators.required, Validators.minLength(4)]],
      captcha_challenge: [null, [Validators.required, Validators.minLength(6)]],
      // mobilePrefix: ['+86'],
      // mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      // captcha: [null, [Validators.required]],
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
  @ViewChild("captchaContainer") captchaContainer: ElementRef;

  // #endregion

  // #region get captcha

  count = 0;
  interval$: any;

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

  ngOnInit(): void {
    this.refreshCaptcha();
  }

  refreshCaptcha(): void {
    this.http
      .post(`api/captcha?_allow_anonymous=true`)
      .subscribe((res: { data: CaptchaChallengeResponse }) => {
        this.captcha = res.data;
        this.form.get("captcha_answer").setValue('');
        this.form.get("captcha_challenge").setValue(res.data.captcha_challenge);
        this.captchaContainer.nativeElement.innerHTML = res.data.captcha_image;
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

    console.timeLog(data);
    this.http.post("api/register?_allow_anonymous=true", data).subscribe(() => {
      this.router.navigateByUrl("/register-result", {
        queryParams: { email: data.email },
      });
    }, (error: HttpErrorResponse) => {
      if (439 === error.status) {
        this.refreshCaptcha();
        this.msg.error(error.error.errors.captcha_answer[0]);
      }
      console.error(error);
    });
  }

  ngOnDestroy(): void {
    if (this.interval$) {
      clearInterval(this.interval$);
    }
  }
}
