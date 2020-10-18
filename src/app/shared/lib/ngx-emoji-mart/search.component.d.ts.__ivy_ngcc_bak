import { AfterViewInit, EventEmitter, OnInit } from '@angular/core';
import { EmojiSearch } from './emoji-search.service';
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
}
