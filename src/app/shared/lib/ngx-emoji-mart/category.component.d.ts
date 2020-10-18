import { ChangeDetectorRef, ElementRef, OnInit } from "@angular/core";
import { Emoji, EmojiService } from "@shared/lib/ngx-emoji-mart/ngx-emoji";
import { EmojiFrequentlyService } from "./emoji-frequently.service";
import * as ɵngcc0 from "@angular/core";
export declare class CategoryComponent implements OnInit {
  ref: ChangeDetectorRef;
  private emojiService;
  private frequently;
  emojis?: any[] | null;
  hasStickyPosition: boolean;
  name: string;
  perLine: number;
  totalFrequentLines: number;
  recent: string[];
  custom: any[];
  i18n: any;
  id: any;
  hideObsolete: boolean;
  notFoundEmoji?: string;
  emojiIsNative?: Emoji["isNative"];
  emojiSkin: Emoji["skin"];
  emojiSize: Emoji["size"];
  emojiSet: Emoji["set"];
  emojiSheetSize: Emoji["sheetSize"];
  emojiForceSize: Emoji["forceSize"];
  emojiTooltip: Emoji["tooltip"];
  emojiBackgroundImageFn?: Emoji["backgroundImageFn"];
  emojiUseButton?: boolean;
  emojiOver: Emoji["emojiOver"];
  emojiLeave: Emoji["emojiLeave"];
  emojiClick: Emoji["emojiClick"];
  container: ElementRef;
  label: ElementRef;
  containerStyles: any;
  labelStyles: any;
  labelSpanStyles: any;
  margin: number;
  minMargin: number;
  maxMargin: number;
  top: number;
  constructor(
    ref: ChangeDetectorRef,
    emojiService: EmojiService,
    frequently: EmojiFrequentlyService
  );
  ngOnInit(): void;
  memoizeSize(): void;
  handleScroll(scrollTop: number): boolean;
  getEmojis(): any[];
  updateDisplay(display: "none" | "block"): void;
  trackById(index: number, item: any): any;
  static ɵfac: ɵngcc0.ɵɵFactoryDef<CategoryComponent, never>;
  static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<
    CategoryComponent,
    "emoji-category",
    never,
    {
      hasStickyPosition: "hasStickyPosition";
      name: "name";
      perLine: "perLine";
      totalFrequentLines: "totalFrequentLines";
      recent: "recent";
      custom: "custom";
      hideObsolete: "hideObsolete";
      emojis: "emojis";
      i18n: "i18n";
      id: "id";
      notFoundEmoji: "notFoundEmoji";
      emojiIsNative: "emojiIsNative";
      emojiSkin: "emojiSkin";
      emojiSize: "emojiSize";
      emojiSet: "emojiSet";
      emojiSheetSize: "emojiSheetSize";
      emojiForceSize: "emojiForceSize";
      emojiTooltip: "emojiTooltip";
      emojiBackgroundImageFn: "emojiBackgroundImageFn";
      emojiUseButton: "emojiUseButton";
    },
    {
      emojiOver: "emojiOver";
      emojiLeave: "emojiLeave";
      emojiClick: "emojiClick";
    },
    never,
    never
  >;
}

//# sourceMappingURL=category.component.d.ts.map
