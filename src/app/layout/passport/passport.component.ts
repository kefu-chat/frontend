import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Component({
  selector: 'layout-passport',
  templateUrl: './passport.component.html',
  styleUrls: ['./passport.component.less'],
})
export class LayoutPassportComponent implements OnInit {
  links = [
    {
      title: '帮助',
      href: '',
    },
    {
      title: '隐私',
      href: '',
    },
    {
      title: '条款',
      href: '',
    },
  ];

  constructor(@Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService, public router: Router) {}

  ngOnInit(): void {
    this.tokenService.clear();
  }

  openComodoSeal(): void {
    window.open(`https://comodo-status.digital-sign.com.cn/ttb_searcher/trustlogo?v_querytype=W&v_shortname=ENTEV&v_search=http://www.kefu.chat&x=6&y=5`, `_comodo_seal`);
  }
}
