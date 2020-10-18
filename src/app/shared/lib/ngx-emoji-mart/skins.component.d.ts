import { EventEmitter } from "@angular/core";
import { Emoji } from "@shared/lib/ngx-emoji-mart/ngx-emoji";
import * as ɵngcc0 from "@angular/core";
export declare class SkinComponent {
  /** currently selected skin */
  skin?: Emoji["skin"];
  i18n: any;
  changeSkin: EventEmitter<number>;
  opened: boolean;
  skinTones: number[];
  toggleOpen(): void;
  isSelected(skinTone: Emoji["skin"]): boolean;
  isVisible(skinTone: Emoji["skin"]): boolean;
  pressed(skinTone: Emoji["skin"]): boolean | "";
  tabIndex(skinTone: Emoji["skin"]): "" | "0";
  expanded(skinTone: Emoji["skin"]): boolean | "";
  handleClick(skin: number): void;
  static ɵfac: ɵngcc0.ɵɵFactoryDef<SkinComponent, never>;
  static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<
    SkinComponent,
    "emoji-skins",
    never,
    { skin: "skin"; i18n: "i18n" },
    { changeSkin: "changeSkin" },
    never,
    never
  >;
}

//# sourceMappingURL=skins.component.d.ts.map
