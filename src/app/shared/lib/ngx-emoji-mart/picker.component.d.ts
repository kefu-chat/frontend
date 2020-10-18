import { ChangeDetectorRef, EventEmitter, OnInit } from "@angular/core";
import {
  Emoji,
  EmojiCategory,
  EmojiData,
  EmojiEvent,
} from "@shared/lib/ngx-emoji-mart/ngx-emoji";
import { EmojiFrequentlyService } from "./emoji-frequently.service";
import * as ɵngcc0 from "@angular/core";
export declare class PickerComponent implements OnInit {
  private ref;
  private frequently;
  perLine: number;
  totalFrequentLines: number;
  i18n: any;
  style: any;
  title: string;
  emoji: string;
  darkMode: boolean;
  color: string;
  hideObsolete: boolean;
  /** all categories shown */
  categories: EmojiCategory[];
  /** used to temporarily draw categories */
  activeCategories: EmojiCategory[];
  set: Emoji["set"];
  skin: Emoji["skin"];
  /** Renders the native unicode emoji */
  isNative: Emoji["isNative"];
  emojiSize: Emoji["size"];
  sheetSize: Emoji["sheetSize"];
  emojisToShowFilter?: (x: string) => boolean;
  showPreview: boolean;
  emojiTooltip: boolean;
  autoFocus: boolean;
  custom: any[];
  hideRecent: boolean;
  include?: string[];
  exclude?: string[];
  notFoundEmoji: string;
  categoriesIcons: {
    [key: string]: string;
  };
  searchIcons: {
    [key: string]: string;
  };
  useButton: boolean;
  enableFrequentEmojiSort: boolean;
  enableSearch: boolean;
  showSingleCategory: boolean;
  emojiClick: EventEmitter<any>;
  emojiSelect: EventEmitter<any>;
  skinChange: EventEmitter<1 | 4 | 2 | 3 | 5 | 6>;
  private scrollRef;
  private previewRef;
  private searchRef;
  private categoryRefs;
  scrollHeight: number;
  clientHeight: number;
  selected?: string;
  nextScroll?: string;
  scrollTop?: number;
  firstRender: boolean;
  recent?: string[];
  previewEmoji: any;
  leaveTimeout: any;
  NAMESPACE: string;
  measureScrollbar: number;
  RECENT_CATEGORY: EmojiCategory;
  SEARCH_CATEGORY: EmojiCategory;
  CUSTOM_CATEGORY: EmojiCategory;
  backgroundImageFn: Emoji["backgroundImageFn"];
  constructor(ref: ChangeDetectorRef, frequently: EmojiFrequentlyService);
  ngOnInit(): void;
  setActiveCategories(categoriesToMakeActive: Array<EmojiCategory>): void;
  updateCategoriesSize(): void;
  handleAnchorClick($event: { category: EmojiCategory; index: number }): void;
  categoryTrack(index: number, item: any): any;
  handleScroll(): void;
  handleSearch($emojis: any[] | null): void;
  handleEnterKey($event: Event, emoji?: EmojiData): void;
  handleEmojiOver($event: EmojiEvent): void;
  handleEmojiLeave(): void;
  handleEmojiClick($event: EmojiEvent): void;
  handleSkinChange(skin: Emoji["skin"]): void;
  getWidth(): string;
  static ɵfac: ɵngcc0.ɵɵFactoryDef<PickerComponent, never>;
  static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<
    PickerComponent,
    "emoji-mart",
    never,
    {
      perLine: "perLine";
      totalFrequentLines: "totalFrequentLines";
      i18n: "i18n";
      style: "style";
      title: "title";
      emoji: "emoji";
      darkMode: "darkMode";
      color: "color";
      hideObsolete: "hideObsolete";
      categories: "categories";
      activeCategories: "activeCategories";
      set: "set";
      skin: "skin";
      isNative: "isNative";
      emojiSize: "emojiSize";
      sheetSize: "sheetSize";
      showPreview: "showPreview";
      emojiTooltip: "emojiTooltip";
      autoFocus: "autoFocus";
      custom: "custom";
      hideRecent: "hideRecent";
      notFoundEmoji: "notFoundEmoji";
      categoriesIcons: "categoriesIcons";
      searchIcons: "searchIcons";
      useButton: "useButton";
      enableFrequentEmojiSort: "enableFrequentEmojiSort";
      enableSearch: "enableSearch";
      showSingleCategory: "showSingleCategory";
      backgroundImageFn: "backgroundImageFn";
      emojisToShowFilter: "emojisToShowFilter";
      include: "include";
      exclude: "exclude";
    },
    {
      emojiClick: "emojiClick";
      emojiSelect: "emojiSelect";
      skinChange: "skinChange";
    },
    never,
    never
  >;
}

//# sourceMappingURL=picker.component.d.ts.map
