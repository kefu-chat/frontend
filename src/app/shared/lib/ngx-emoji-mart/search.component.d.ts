import { AfterViewInit, EventEmitter, OnInit } from '@angular/core';
import { EmojiSearch } from './emoji-search.service';
import * as ɵngcc0 from '@angular/core';
export declare class SearchComponent implements AfterViewInit, OnInit {
    private emojiSearch;
    maxResults: number;
    autoFocus: boolean;
    i18n: any;
    include: string[];
    exclude: string[];
    custom: any[];
    icons: {
        [key: string]: string;
    };
    emojisToShowFilter?: (x: any) => boolean;
    searchResults: EventEmitter<any[]>;
    enterKey: EventEmitter<any>;
    private inputRef;
    isSearching: boolean;
    icon?: string;
    query: string;
    inputId: string;
    constructor(emojiSearch: EmojiSearch);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    clear(): void;
    handleEnterKey($event: Event): void;
    handleSearch(value: string): void;
    handleChange(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<SearchComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<SearchComponent, "emoji-search", never, { "maxResults": "maxResults"; "autoFocus": "autoFocus"; "include": "include"; "exclude": "exclude"; "custom": "custom"; "i18n": "i18n"; "icons": "icons"; "emojisToShowFilter": "emojisToShowFilter"; }, { "searchResults": "searchResults"; "enterKey": "enterKey"; }, never, never>;
}

//# sourceMappingURL=search.component.d.ts.map