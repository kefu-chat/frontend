import { ScrollingModule } from "@angular/cdk/scrolling";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { DelonACLModule } from "@delon/acl";
import { DelonFormModule } from "@delon/form";
import { AlainThemeModule } from "@delon/theme";
import { TranslateModule } from "@ngx-translate/core";

import { SHARED_DELON_MODULES } from "./shared-delon.module";
import { SHARED_ZORRO_MODULES } from "./shared-zorro.module";

// #region third libs
import { CountdownModule } from "ngx-countdown";
import { NgxTinymceModule } from "ngx-tinymce";
import { UEditorModule } from "ngx-ueditor";

import { PickerModule } from "@shared/lib/ngx-emoji-mart";
import { EmojiModule } from "@shared/lib/ngx-emoji-mart/ngx-emoji";
import { QRCodeModule } from "angularx-qrcode";

const THIRDMODULES = [
  CountdownModule,
  UEditorModule,
  NgxTinymceModule,
  PickerModule,
  EmojiModule,
  QRCodeModule,
];
// #endregion

// #region your componets & directives
const COMPONENTS = [];
const DIRECTIVES = [];
// #endregion

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AlainThemeModule.forChild(),
    DelonACLModule,
    DelonFormModule,
    ScrollingModule,
    ...SHARED_DELON_MODULES,
    ...SHARED_ZORRO_MODULES,
    // third libs
    ...THIRDMODULES,
  ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AlainThemeModule,
    DelonACLModule,
    DelonFormModule,
    ScrollingModule,
    TranslateModule,
    ...SHARED_DELON_MODULES,
    ...SHARED_ZORRO_MODULES,
    // third libs
    ...THIRDMODULES,
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
})
export class SharedModule {}
