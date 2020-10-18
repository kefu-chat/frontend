import { EventEmitter } from "@angular/core";
import { EmojiCategory } from "@shared/lib/ngx-emoji-mart/ngx-emoji";
import * as ɵngcc0 from "@angular/core";
export declare class AnchorsComponent {
  categories: EmojiCategory[];
  color?: string;
  selected?: string;
  i18n: any;
  icons: {
    [key: string]: string;
  };
  anchorClick: EventEmitter<{
    category: EmojiCategory;
    index: number;
  }>;
  trackByFn(idx: number, cat: EmojiCategory): string;
  handleClick($event: Event, index: number): void;
  static ɵfac: ɵngcc0.ɵɵFactoryDef<AnchorsComponent, never>;
  static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<
    AnchorsComponent,
    "emoji-mart-anchors",
    never,
    {
      categories: "categories";
      icons: "icons";
      color: "color";
      selected: "selected";
      i18n: "i18n";
    },
    { anchorClick: "anchorClick" },
    never,
    never
  >;
}

//# sourceMappingURL=anchors.component.d.ts.map
