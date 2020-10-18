import { ChangeDetectorRef, EventEmitter, OnChanges } from "@angular/core";
import {
  Emoji,
  EmojiData,
  EmojiService,
} from "@shared/lib/ngx-emoji-mart/ngx-emoji";
import * as ɵngcc0 from "@angular/core";
export declare class PreviewComponent implements OnChanges {
  ref: ChangeDetectorRef;
  private emojiService;
  title?: string;
  emoji: any;
  idleEmoji: any;
  i18n: any;
  emojiIsNative?: Emoji["isNative"];
  emojiSkin?: Emoji["skin"];
  emojiSize?: Emoji["size"];
  emojiSet?: Emoji["set"];
  emojiSheetSize?: Emoji["sheetSize"];
  emojiBackgroundImageFn?: Emoji["backgroundImageFn"];
  skinChange: EventEmitter<number>;
  emojiData: Partial<EmojiData>;
  listedEmoticons?: string[];
  constructor(ref: ChangeDetectorRef, emojiService: EmojiService);
  ngOnChanges(): void;
  static ɵfac: ɵngcc0.ɵɵFactoryDef<PreviewComponent, never>;
  static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<
    PreviewComponent,
    "emoji-preview",
    never,
    {
      title: "title";
      emoji: "emoji";
      idleEmoji: "idleEmoji";
      i18n: "i18n";
      emojiIsNative: "emojiIsNative";
      emojiSkin: "emojiSkin";
      emojiSize: "emojiSize";
      emojiSet: "emojiSet";
      emojiSheetSize: "emojiSheetSize";
      emojiBackgroundImageFn: "emojiBackgroundImageFn";
    },
    { skinChange: "skinChange" },
    never,
    never
  >;
}

//# sourceMappingURL=preview.component.d.ts.map
