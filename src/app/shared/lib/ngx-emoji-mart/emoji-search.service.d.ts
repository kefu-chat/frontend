import { EmojiData, EmojiService } from "@shared/lib/ngx-emoji-mart/ngx-emoji";
import * as ɵngcc0 from "@angular/core";
export declare class EmojiSearch {
  private emojiService;
  originalPool: any;
  index: {
    results?: EmojiData[];
    pool?: {
      [key: string]: EmojiData;
    };
    [key: string]: any;
  };
  emojisList: any;
  emoticonsList: {
    [key: string]: string;
  };
  emojiSearch: {
    [key: string]: string;
  };
  constructor(emojiService: EmojiService);
  addCustomToPool(custom: any, pool: any): void;
  search(
    value: string,
    emojisToShowFilter?: (x: any) => boolean,
    maxResults?: number,
    include?: any[],
    exclude?: any[],
    custom?: any[]
  ): EmojiData[] | null;
  buildSearch(
    shortNames: string[],
    name: string,
    id: string,
    keywords: string[],
    emoticons: string[]
  ): string;
  static ɵfac: ɵngcc0.ɵɵFactoryDef<EmojiSearch, never>;
}

//# sourceMappingURL=emoji-search.service.d.ts.map
