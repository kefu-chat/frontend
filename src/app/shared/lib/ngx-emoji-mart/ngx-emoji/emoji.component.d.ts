import { EventEmitter, OnChanges } from '@angular/core';
import { EmojiData } from './data/data.interfaces';
import { EmojiService } from './emoji.service';
import * as ɵngcc0 from '@angular/core';
export interface Emoji {
    /** Renders the native unicode emoji */
    isNative: boolean;
    forceSize: boolean;
    tooltip: boolean;
    skin: 1 | 2 | 3 | 4 | 5 | 6;
    sheetSize: 16 | 20 | 32 | 64;
    sheetRows?: number;
    set: 'apple' | 'google' | 'twitter' | 'facebook' | '';
    size: number;
    emoji: string | EmojiData;
    backgroundImageFn: (set: string, sheetSize: number) => string;
    fallback?: (data: any, props: any) => string;
    emojiOver: EventEmitter<EmojiEvent>;
    emojiLeave: EventEmitter<EmojiEvent>;
    emojiClick: EventEmitter<EmojiEvent>;
}
export interface EmojiEvent {
    emoji: EmojiData;
    $event: Event;
}
export declare class EmojiComponent implements OnChanges, Emoji {
    private emojiService;
    skin: Emoji['skin'];
    set: Emoji['set'];
    sheetSize: Emoji['sheetSize'];
    /** Renders the native unicode emoji */
    isNative: Emoji['isNative'];
    forceSize: Emoji['forceSize'];
    tooltip: Emoji['tooltip'];
    size: Emoji['size'];
    emoji: Emoji['emoji'];
    fallback?: Emoji['fallback'];
    hideObsolete: boolean;
    SHEET_COLUMNS: number;
    sheetRows?: number;
    sheetColumns?: number;
    useButton?: boolean;
    emojiOver: Emoji['emojiOver'];
    emojiLeave: Emoji['emojiLeave'];
    emojiClick: Emoji['emojiClick'];
    style: any;
    title: string;
    label: string;
    unified?: string | null;
    custom: boolean;
    isVisible: boolean;
    backgroundImageFn: Emoji['backgroundImageFn'];
    constructor(emojiService: EmojiService);
    ngOnChanges(): boolean;
    getData(): EmojiData;
    getSanitizedData(): EmojiData;
    handleClick($event: Event): void;
    handleOver($event: Event): void;
    handleLeave($event: Event): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<EmojiComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<EmojiComponent, "ngx-emoji", never, { "skin": "skin"; "set": "set"; "sheetSize": "sheetSize"; "isNative": "isNative"; "forceSize": "forceSize"; "tooltip": "tooltip"; "size": "size"; "emoji": "emoji"; "hideObsolete": "hideObsolete"; "SHEET_COLUMNS": "SHEET_COLUMNS"; "backgroundImageFn": "backgroundImageFn"; "fallback": "fallback"; "sheetRows": "sheetRows"; "sheetColumns": "sheetColumns"; "useButton": "useButton"; }, { "emojiOver": "emojiOver"; "emojiLeave": "emojiLeave"; "emojiClick": "emojiClick"; }, never, ["*", "*"]>;
}

//# sourceMappingURL=emoji.component.d.ts.map