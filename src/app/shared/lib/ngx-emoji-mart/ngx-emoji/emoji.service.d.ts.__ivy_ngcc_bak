import { CompressedEmojiData, EmojiData } from './data/data.interfaces';
import { Emoji } from './emoji.component';
export declare const DEFAULT_BACKGROUNDFN: (set: string, sheetSize: number) => string;
export declare class EmojiService {
    uncompressed: boolean;
    names: {
        [key: string]: EmojiData;
    };
    emojis: EmojiData[];
    constructor();
    uncompress(list: CompressedEmojiData[]): void;
    getData(emoji: EmojiData | string, skin?: Emoji['skin'], set?: Emoji['set']): EmojiData | null;
    unifiedToNative(unified: string): string;
    emojiSpriteStyles(sheet: EmojiData['sheet'], set?: Emoji['set'], size?: Emoji['size'], sheetSize?: Emoji['sheetSize'], sheetRows?: Emoji['sheetRows'], backgroundImageFn?: Emoji['backgroundImageFn'], sheetColumns?: number): {
        width: string;
        height: string;
        display: string;
        'background-image': string;
        'background-size': string;
        'background-position': string;
    };
    getSpritePosition(sheet: EmojiData['sheet'], sheetColumns: number): string;
    sanitize(emoji: EmojiData | null): EmojiData | null;
    getSanitizedData(emoji: string | EmojiData, skin?: Emoji['skin'], set?: Emoji['set']): EmojiData;
}
