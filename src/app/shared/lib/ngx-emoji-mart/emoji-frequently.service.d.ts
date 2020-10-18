import { EmojiData } from "@shared/lib/ngx-emoji-mart/ngx-emoji";
import * as ɵngcc0 from "@angular/core";
export declare class EmojiFrequentlyService {
  NAMESPACE: string;
  frequently: {
    [key: string]: number;
  } | null;
  defaults: {
    [key: string]: number;
  };
  initialized: boolean;
  DEFAULTS: string[];
  init(): void;
  add(emoji: EmojiData): void;
  get(perLine: number, totalLines: number): any[];
  static ɵfac: ɵngcc0.ɵɵFactoryDef<EmojiFrequentlyService, never>;
}

//# sourceMappingURL=emoji-frequently.service.d.ts.map
