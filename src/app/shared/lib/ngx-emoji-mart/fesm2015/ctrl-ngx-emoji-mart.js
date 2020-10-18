import {
  EventEmitter,
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  ɵɵdefineInjectable,
  Injectable,
  ChangeDetectorRef,
  ViewChild,
  ɵɵinject,
  ViewChildren,
  NgModule,
} from "@angular/core";
import {
  EmojiService,
  categories as categories$1,
  EmojiModule,
} from "@shared/lib/ngx-emoji-mart/ngx-emoji";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

class AnchorsComponent {
  constructor() {
    this.categories = [];
    this.icons = {};
    this.anchorClick = new EventEmitter();
  }
  trackByFn(idx, cat) {
    return cat.id;
  }
  handleClick($event, index) {
    this.anchorClick.emit({
      category: this.categories[index],
      index,
    });
  }
}
AnchorsComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: "emoji-mart-anchors",
        template: `
  <div class="emoji-mart-anchors">
    <ng-template ngFor let-category [ngForOf]="categories" let-idx="index" [ngForTrackBy]="trackByFn">
      <span
        *ngIf="category.anchor !== false"
        [attr.title]="i18n.categories[category.id]"
        (click)="this.handleClick($event, idx)"
        class="emoji-mart-anchor"
        [class.emoji-mart-anchor-selected]="category.name === selected"
        [style.color]="category.name === selected ? color : null"
      >
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path [attr.d]="icons[category.id]" />
          </svg>
        </div>
        <span class="emoji-mart-anchor-bar" [style.background-color]="color"></span>
      </span>
    </ng-template>
  </div>
  `,
        changeDetection: ChangeDetectionStrategy.OnPush,
        preserveWhitespaces: false,
      },
    ],
  },
];
AnchorsComponent.propDecorators = {
  categories: [{ type: Input }],
  color: [{ type: Input }],
  selected: [{ type: Input }],
  i18n: [{ type: Input }],
  icons: [{ type: Input }],
  anchorClick: [{ type: Output }],
};

class EmojiFrequentlyService {
  constructor() {
    this.NAMESPACE = "emoji-mart";
    this.frequently = null;
    this.defaults = {};
    this.initialized = false;
    this.DEFAULTS = [
      "+1",
      "grinning",
      "kissing_heart",
      "heart_eyes",
      "laughing",
      "stuck_out_tongue_winking_eye",
      "sweat_smile",
      "joy",
      "scream",
      "disappointed",
      "unamused",
      "weary",
      "sob",
      "sunglasses",
      "heart",
      "poop",
    ];
  }
  init() {
    this.frequently = JSON.parse(
      localStorage.getItem(`${this.NAMESPACE}.frequently`) || "null"
    );
    this.initialized = true;
  }
  add(emoji) {
    if (!this.initialized) {
      this.init();
    }
    if (!this.frequently) {
      this.frequently = this.defaults;
    }
    if (!this.frequently[emoji.id]) {
      this.frequently[emoji.id] = 0;
    }
    this.frequently[emoji.id] += 1;
    localStorage.setItem(`${this.NAMESPACE}.last`, emoji.id);
    localStorage.setItem(
      `${this.NAMESPACE}.frequently`,
      JSON.stringify(this.frequently)
    );
  }
  get(perLine, totalLines) {
    if (!this.initialized) {
      this.init();
    }
    if (this.frequently === null) {
      this.defaults = {};
      const result = [];
      for (let i = 0; i < perLine; i++) {
        this.defaults[this.DEFAULTS[i]] = perLine - i;
        result.push(this.DEFAULTS[i]);
      }
      return result;
    }
    const quantity = perLine * totalLines;
    const frequentlyKeys = Object.keys(this.frequently);
    const sorted = frequentlyKeys
      .sort((a, b) => this.frequently[a] - this.frequently[b])
      .reverse();
    const sliced = sorted.slice(0, quantity);
    const last = localStorage.getItem(`${this.NAMESPACE}.last`);
    if (last && !sliced.includes(last)) {
      sliced.pop();
      sliced.push(last);
    }
    return sliced;
  }
}
EmojiFrequentlyService.ɵprov = ɵɵdefineInjectable({
  factory: function EmojiFrequentlyService_Factory() {
    return new EmojiFrequentlyService();
  },
  token: EmojiFrequentlyService,
  providedIn: "root",
});
EmojiFrequentlyService.decorators = [
  { type: Injectable, args: [{ providedIn: "root" }] },
];

class CategoryComponent {
  constructor(ref, emojiService, frequently) {
    this.ref = ref;
    this.emojiService = emojiService;
    this.frequently = frequently;
    this.hasStickyPosition = true;
    this.name = "";
    this.perLine = 9;
    this.totalFrequentLines = 4;
    this.recent = [];
    this.custom = [];
    this.hideObsolete = true;
    this.emojiOver = new EventEmitter();
    this.emojiLeave = new EventEmitter();
    this.emojiClick = new EventEmitter();
    this.containerStyles = {};
    this.labelStyles = {};
    this.labelSpanStyles = {};
    this.margin = 0;
    this.minMargin = 0;
    this.maxMargin = 0;
    this.top = 0;
  }
  ngOnInit() {
    this.emojis = this.getEmojis();
    if (!this.emojis) {
      this.containerStyles = { display: "none" };
    }
    if (!this.hasStickyPosition) {
      this.labelStyles = { height: 28 };
      // this.labelSpanStyles = { position: 'absolute' };
    }
  }
  memoizeSize() {
    const parent = this.container.nativeElement.parentNode.parentNode;
    const {
      top,
      height,
    } = this.container.nativeElement.getBoundingClientRect();
    const parentTop = parent.getBoundingClientRect().top;
    const labelHeight = this.label.nativeElement.getBoundingClientRect().height;
    this.top = top - parentTop + parent.scrollTop;
    if (height === 0) {
      this.maxMargin = 0;
    } else {
      this.maxMargin = height - labelHeight;
    }
  }
  handleScroll(scrollTop) {
    let margin = scrollTop - this.top;
    margin = margin < this.minMargin ? this.minMargin : margin;
    margin = margin > this.maxMargin ? this.maxMargin : margin;
    if (margin === this.margin) {
      return false;
    }
    if (!this.hasStickyPosition) {
      this.label.nativeElement.style.top = `${margin}px`;
    }
    this.margin = margin;
    return true;
  }
  getEmojis() {
    if (this.name === "Recent") {
      let frequentlyUsed =
        this.recent ||
        this.frequently.get(this.perLine, this.totalFrequentLines);
      if (!frequentlyUsed || !frequentlyUsed.length) {
        frequentlyUsed = this.frequently.get(
          this.perLine,
          this.totalFrequentLines
        );
      }
      if (frequentlyUsed.length) {
        this.emojis = frequentlyUsed
          .map((id) => {
            const emoji = this.custom.filter((e) => e.id === id)[0];
            if (emoji) {
              return emoji;
            }
            return id;
          })
          .filter((id) => !!this.emojiService.getData(id));
      }
      if (
        (!this.emojis || this.emojis.length === 0) &&
        frequentlyUsed.length > 0
      ) {
        return null;
      }
    }
    if (this.emojis) {
      this.emojis = this.emojis.slice(0);
    }
    return this.emojis;
  }
  updateDisplay(display) {
    this.containerStyles.display = display;
    this.getEmojis();
    this.ref.detectChanges();
  }
  trackById(index, item) {
    return item;
  }
}
CategoryComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: "emoji-category",
        template: `
  <section #container class="emoji-mart-category"
    [attr.aria-label]="i18n.categories[id]"
    [class.emoji-mart-no-results]="emojis && !emojis.length"
    [ngStyle]="containerStyles">
    <div class="emoji-mart-category-label"
      [ngStyle]="labelStyles"
      [attr.data-name]="name">
      <!-- already labeled by the section aria-label -->
      <span #label [ngStyle]="labelSpanStyles" aria-hidden="true">
        {{ i18n.categories[id] }}
      </span>
    </div>

    <ng-template [ngIf]="emojis">
      <ngx-emoji
        *ngFor="let emoji of emojis; trackBy: trackById"
        [emoji]="emoji"
        [size]="emojiSize"
        [skin]="emojiSkin"
        [isNative]="emojiIsNative"
        [set]="emojiSet"
        [sheetSize]="emojiSheetSize"
        [forceSize]="emojiForceSize"
        [tooltip]="emojiTooltip"
        [backgroundImageFn]="emojiBackgroundImageFn"
        [hideObsolete]="hideObsolete"
        (emojiOver)="emojiOver.emit($event)"
        (emojiLeave)="emojiLeave.emit($event)"
        (emojiClick)="emojiClick.emit($event)"
      ></ngx-emoji>
    </ng-template>

    <div *ngIf="emojis && !emojis.length">
      <div>
        <ngx-emoji
          [emoji]="notFoundEmoji"
          size="38"
          [skin]="emojiSkin"
          [isNative]="emojiIsNative"
          [set]="emojiSet"
          [sheetSize]="emojiSheetSize"
          [forceSize]="emojiForceSize"
          [tooltip]="emojiTooltip"
          [backgroundImageFn]="emojiBackgroundImageFn"
          [useButton]="emojiUseButton"
        ></ngx-emoji>
      </div>

      <div class="emoji-mart-no-results-label">
        {{ i18n.notfound }}
      </div>
    </div>

  </section>
  `,
        changeDetection: ChangeDetectionStrategy.OnPush,
        preserveWhitespaces: false,
      },
    ],
  },
];
CategoryComponent.ctorParameters = () => [
  { type: ChangeDetectorRef },
  { type: EmojiService },
  { type: EmojiFrequentlyService },
];
CategoryComponent.propDecorators = {
  emojis: [{ type: Input }],
  hasStickyPosition: [{ type: Input }],
  name: [{ type: Input }],
  perLine: [{ type: Input }],
  totalFrequentLines: [{ type: Input }],
  recent: [{ type: Input }],
  custom: [{ type: Input }],
  i18n: [{ type: Input }],
  id: [{ type: Input }],
  hideObsolete: [{ type: Input }],
  notFoundEmoji: [{ type: Input }],
  emojiIsNative: [{ type: Input }],
  emojiSkin: [{ type: Input }],
  emojiSize: [{ type: Input }],
  emojiSet: [{ type: Input }],
  emojiSheetSize: [{ type: Input }],
  emojiForceSize: [{ type: Input }],
  emojiTooltip: [{ type: Input }],
  emojiBackgroundImageFn: [{ type: Input }],
  emojiUseButton: [{ type: Input }],
  emojiOver: [{ type: Output }],
  emojiLeave: [{ type: Output }],
  emojiClick: [{ type: Output }],
  container: [{ type: ViewChild, args: ["container", { static: true }] }],
  label: [{ type: ViewChild, args: ["label", { static: true }] }],
};

function uniq(arr) {
  return arr.reduce((acc, item) => {
    if (!acc.includes(item)) {
      acc.push(item);
    }
    return acc;
  }, []);
}
function intersect(a, b) {
  const uniqA = uniq(a);
  const uniqB = uniq(b);
  return uniqA.filter((item) => uniqB.indexOf(item) >= 0);
}
// https://github.com/sonicdoe/measure-scrollbar
function measureScrollbar() {
  if (typeof document === "undefined") {
    return 0;
  }
  const div = document.createElement("div");
  div.style.width = "100px";
  div.style.height = "100px";
  div.style.overflow = "scroll";
  div.style.position = "absolute";
  div.style.top = "-9999px";
  document.body.appendChild(div);
  const scrollbarWidth = div.offsetWidth - div.clientWidth;
  document.body.removeChild(div);
  return scrollbarWidth;
}

class EmojiSearch {
  constructor(emojiService) {
    this.emojiService = emojiService;
    this.originalPool = {};
    this.index = {};
    this.emojisList = {};
    this.emoticonsList = {};
    this.emojiSearch = {};
    for (const emojiData of this.emojiService.emojis) {
      const { shortNames, emoticons } = emojiData;
      const id = shortNames[0];
      emoticons.forEach((emoticon) => {
        if (this.emoticonsList[emoticon]) {
          return;
        }
        this.emoticonsList[emoticon] = id;
      });
      this.emojisList[id] = this.emojiService.getSanitizedData(id);
      this.originalPool[id] = emojiData;
    }
  }
  addCustomToPool(custom, pool) {
    custom.forEach((emoji) => {
      const emojiId = emoji.id || emoji.shortNames[0];
      if (emojiId && !pool[emojiId]) {
        pool[emojiId] = this.emojiService.getData(emoji);
        this.emojisList[emojiId] = this.emojiService.getSanitizedData(emoji);
      }
    });
  }
  search(
    value,
    emojisToShowFilter,
    maxResults = 75,
    include = [],
    exclude = [],
    custom = []
  ) {
    this.addCustomToPool(custom, this.originalPool);
    let results;
    let pool = this.originalPool;
    if (value.length) {
      if (value === "-" || value === "-1") {
        return [this.emojisList["-1"]];
      }
      if (value === "+" || value === "+1") {
        return [this.emojisList["+1"]];
      }
      let values = value.toLowerCase().split(/[\s|,|\-|_]+/);
      let allResults = [];
      if (values.length > 2) {
        values = [values[0], values[1]];
      }
      if (include.length || exclude.length) {
        pool = {};
        categories$1.forEach((category) => {
          var _a;
          const isIncluded =
            include && include.length
              ? include.indexOf(category.id) > -1
              : true;
          const isExcluded =
            exclude && exclude.length
              ? exclude.indexOf(category.id) > -1
              : false;
          if (!isIncluded || isExcluded) {
            return;
          }
          (_a = category.emojis) === null || _a === void 0
            ? void 0
            : _a.forEach((emojiId) => {
                var _a;
                // Need to make sure that pool gets keyed
                // with the correct id, which is why we call emojiService.getData below
                const emoji = this.emojiService.getData(emojiId);
                pool[
                  (_a =
                    emoji === null || emoji === void 0 ? void 0 : emoji.id) !==
                    null && _a !== void 0
                    ? _a
                    : ""
                ] = emoji;
              });
        });
        if (custom.length) {
          const customIsIncluded =
            include && include.length ? include.indexOf("custom") > -1 : true;
          const customIsExcluded =
            exclude && exclude.length ? exclude.indexOf("custom") > -1 : false;
          if (customIsIncluded && !customIsExcluded) {
            this.addCustomToPool(custom, pool);
          }
        }
      }
      allResults = values
        .map((v) => {
          let aPool = pool;
          let aIndex = this.index;
          let length = 0;
          // tslint:disable-next-line: prefer-for-of
          for (let charIndex = 0; charIndex < v.length; charIndex++) {
            const char = v[charIndex];
            length++;
            if (!aIndex[char]) {
              aIndex[char] = {};
            }
            aIndex = aIndex[char];
            if (!aIndex.results) {
              const scores = {};
              aIndex.results = [];
              aIndex.pool = {};
              for (const id of Object.keys(aPool)) {
                const emoji = aPool[id];
                if (!this.emojiSearch[id]) {
                  this.emojiSearch[id] = this.buildSearch(
                    emoji.short_names,
                    emoji.name,
                    emoji.id,
                    emoji.keywords,
                    emoji.emoticons
                  );
                }
                const query = this.emojiSearch[id];
                const sub = v.substr(0, length);
                const subIndex = query.indexOf(sub);
                if (subIndex !== -1) {
                  let score = subIndex + 1;
                  if (sub === id) {
                    score = 0;
                  }
                  aIndex.results.push(this.emojisList[id]);
                  aIndex.pool[id] = emoji;
                  scores[id] = score;
                }
              }
              aIndex.results.sort((a, b) => {
                const aScore = scores[a.id];
                const bScore = scores[b.id];
                return aScore - bScore;
              });
            }
            aPool = aIndex.pool;
          }
          return aIndex.results;
        })
        .filter((a) => a);
      if (allResults.length > 1) {
        results = intersect.apply(null, allResults);
      } else if (allResults.length) {
        results = allResults[0];
      } else {
        results = [];
      }
    }
    if (results) {
      if (emojisToShowFilter) {
        results = results.filter((result) => {
          if (result && result.id) {
            return emojisToShowFilter(this.emojiService.names[result.id]);
          }
          return false;
        });
      }
      if (results && results.length > maxResults) {
        results = results.slice(0, maxResults);
      }
    }
    return results || null;
  }
  buildSearch(shortNames, name, id, keywords, emoticons) {
    const search = [];
    const addToSearch = (strings, split) => {
      if (!strings) {
        return;
      }
      (Array.isArray(strings) ? strings : [strings]).forEach((str) => {
        (split ? str.split(/[-|_|\s]+/) : [str]).forEach((s) => {
          s = s.toLowerCase();
          if (!search.includes(s)) {
            search.push(s);
          }
        });
      });
    };
    addToSearch(shortNames, true);
    addToSearch(name, true);
    addToSearch(id, true);
    addToSearch(keywords, true);
    addToSearch(emoticons, false);
    return search.join(",");
  }
}
EmojiSearch.ɵprov = ɵɵdefineInjectable({
  factory: function EmojiSearch_Factory() {
    return new EmojiSearch(ɵɵinject(EmojiService));
  },
  token: EmojiSearch,
  providedIn: "root",
});
EmojiSearch.decorators = [{ type: Injectable, args: [{ providedIn: "root" }] }];
EmojiSearch.ctorParameters = () => [{ type: EmojiService }];

/* tslint:disable max-line-length */
const categories = {
  activity: `M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24m10 11h-5c.3-2.5 1.3-4.8 2-6.1a10 10 0 0 1 3 6.1m-9 0V2a10 10 0 0 1 4.4 1.6A18 18 0 0 0 15 11h-2zm-2 0H9a18 18 0 0 0-2.4-7.4A10 10 0 0 1 11 2.1V11zm0 2v9a10 10 0 0 1-4.4-1.6A18 18 0 0 0 9 13h2zm4 0a18 18 0 0 0 2.4 7.4 10 10 0 0 1-4.4 1.5V13h2zM5 4.9c.7 1.3 1.7 3.6 2 6.1H2a10 10 0 0 1 3-6.1M2 13h5c-.3 2.5-1.3 4.8-2 6.1A10 10 0 0 1 2 13m17 6.1c-.7-1.3-1.7-3.6-2-6.1h5a10 10 0 0 1-3 6.1`,
  custom: `M10 1h3v21h-3zm10.186 4l1.5 2.598L3.5 18.098 2 15.5zM2 7.598L3.5 5l18.186 10.5-1.5 2.598z`,
  flags: `M0 0l6 24h2L2 0zm21 5h-4l-1-4H4l3 12h3l1 4h13L21 5zM6.6 3h7.8l2 8H8.6l-2-8zm8.8 10l-2.9 1.9-.4-1.9h3.3zm3.6 0l-1.5-6h2l2 8H16l3-2z`,
  foods: `M17 5c-1.8 0-2.9.4-3.7 1 .5-1.3 1.8-3 4.7-3a1 1 0 0 0 0-2c-3 0-4.6 1.3-5.5 2.5l-.2.2c-.6-1.9-1.5-3.7-3-3.7C8.5 0 7.7.3 7 1c-2 1.5-1.7 2.9-.5 4C3.6 5.2 0 7.4 0 13c0 4.6 5 11 9 11 2 0 2.4-.5 3-1 .6.5 1 1 3 1 4 0 9-6.4 9-11 0-6-4-8-7-8M8.2 2.5c.7-.5 1-.5 1-.5.4.2 1 1.4 1.4 3-1.6-.6-2.8-1.3-3-1.8l.6-.7M15 22c-1 0-1.2-.1-1.6-.4l-.1-.2a2 2 0 0 0-2.6 0l-.1.2c-.4.3-.5.4-1.6.4-2.8 0-7-5.4-7-9 0-6 4.5-6 5-6 2 0 2.5.4 3.4 1.2l.3.3a2 2 0 0 0 2.6 0l.3-.3c1-.8 1.5-1.2 3.4-1.2.5 0 5 .1 5 6 0 3.6-4.2 9-7 9`,
  nature: `M15.5 8a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m-7 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m10.43-8h-.02c-.97 0-2.14.79-3.02 1.5A13.88 13.88 0 0 0 12 .99c-1.28 0-2.62.13-3.87.51C7.24.8 6.07 0 5.09 0h-.02C3.35 0 .07 2.67 0 7.03c-.04 2.47.28 4.23 1.04 5 .26.27.88.69 1.3.9.19 3.17.92 5.23 2.53 6.37.9.64 2.19.95 3.2 1.1-.03.2-.07.4-.07.6 0 1.77 2.35 3 4 3s4-1.23 4-3c0-.2-.04-.4-.07-.59 2.57-.38 5.43-1.87 5.92-7.58.4-.22.89-.57 1.1-.8.77-.76 1.09-2.52 1.05-5C23.93 2.67 20.65 0 18.93 0M3.23 9.13c-.24.29-.84 1.16-.9 1.24A9.67 9.67 0 0 1 2 7.08c.05-3.28 2.48-4.97 3.1-5.03.25.02.72.27 1.26.65A7.95 7.95 0 0 0 4 7.82c-.14.55-.4.86-.79 1.31M12 22c-.9 0-1.95-.7-2-1 0-.65.47-1.24 1-1.6v.6a1 1 0 1 0 2 0v-.6c.52.36 1 .95 1 1.6-.05.3-1.1 1-2 1m3-3.48v.02a4.75 4.75 0 0 0-1.26-1.02c1.09-.52 2.24-1.33 2.24-2.22 0-1.84-1.78-2.2-3.98-2.2s-3.98.36-3.98 2.2c0 .89 1.15 1.7 2.24 2.22A4.8 4.8 0 0 0 9 18.54v-.03a6.1 6.1 0 0 1-2.97-.84c-1.3-.92-1.84-3.04-1.86-6.48l.03-.04c.5-.82 1.49-1.45 1.8-3.1C6 6 7.36 4.42 8.36 3.53c1.01-.35 2.2-.53 3.59-.53 1.45 0 2.68.2 3.73.57 1 .9 2.32 2.46 2.32 4.48.31 1.65 1.3 2.27 1.8 3.1l.1.18c-.06 5.97-1.95 7.01-4.9 7.19m6.63-8.2l-.11-.2a7.59 7.59 0 0 0-.74-.98 3.02 3.02 0 0 1-.79-1.32 7.93 7.93 0 0 0-2.35-5.12c.53-.38 1-.63 1.26-.65.64.07 3.05 1.77 3.1 5.03.02 1.81-.35 3.22-.37 3.24`,
  objects: `M12 0a9 9 0 0 0-5 16.5V21s2 3 5 3 5-3 5-3v-4.5A9 9 0 0 0 12 0zm0 2a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM9 17.5a9 9 0 0 0 6 0v.8a7 7 0 0 1-3 .7 7 7 0 0 1-3-.7v-.8zm.2 3a8.9 8.9 0 0 0 2.8.5c1 0 1.9-.2 2.8-.5-.6.7-1.6 1.5-2.8 1.5-1.1 0-2.1-.8-2.8-1.5zm5.5-8.1c-.8 0-1.1-.8-1.5-1.8-.5-1-.7-1.5-1.2-1.5s-.8.5-1.3 1.5c-.4 1-.8 1.8-1.6 1.8h-.3c-.5-.2-.8-.7-1.3-1.8l-.2-1A3 3 0 0 0 7 9a1 1 0 0 1 0-2c1.7 0 2 1.4 2.2 2.1.5-1 1.3-2 2.8-2 1.5 0 2.3 1.1 2.7 2.1.2-.8.6-2.2 2.3-2.2a1 1 0 1 1 0 2c-.2 0-.3.5-.3.7a6.5 6.5 0 0 1-.3 1c-.5 1-.8 1.7-1.7 1.7`,
  people: `M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24m0 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20M8 7a2 2 0 1 0 0 4 2 2 0 0 0 0-4m8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-.8 8c-.7 1.2-1.8 2-3.3 2-1.5 0-2.7-.8-3.4-2H15m3-2H6a6 6 0 1 0 12 0`,
  places: `M6.5 12a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5m0 3c-.3 0-.5-.2-.5-.5s.2-.5.5-.5.5.2.5.5-.2.5-.5.5m11-3a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5m0 3c-.3 0-.5-.2-.5-.5s.2-.5.5-.5.5.2.5.5-.2.5-.5.5m5-5.5l-1-.4-.1-.1h.6c.6 0 1-.4 1-1 0-1-.9-2-2-2h-.6l-.8-1.7A3 3 0 0 0 16.8 2H7.2a3 3 0 0 0-2.8 2.3L3.6 6H3a2 2 0 0 0-2 2c0 .6.4 1 1 1h.6v.1l-1 .4a2 2 0 0 0-1.4 2l.7 7.6a1 1 0 0 0 1 .9H3v1c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-1h6v1c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-1h1.1a1 1 0 0 0 1-.9l.7-7.5a2 2 0 0 0-1.3-2.1M6.3 4.9c.1-.5.5-.9 1-.9h9.5c.4 0 .8.4 1 .9L19.2 9H4.7l1.6-4.1zM7 21H5v-1h2v1zm12 0h-2v-1h2v1zm2.2-3H2.8l-.7-6.6.9-.4h18l.9.4-.7 6.6z`,
  recent: `M13 4h-2v7H9v2h2v2h2v-2h4v-2h-4zm-1-4a12 12 0 1 0 0 24 12 12 0 0 0 0-24m0 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20`,
  symbols: `M0 0h11v2H0zm4 11h3V6h4V4H0v2h4zm11.5 6a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5m0-2.99a.5.5 0 0 1 0 .99c-.28 0-.5-.22-.5-.5s.22-.49.5-.49m6 5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5m0 2.99a.5.5 0 0 1-.5-.5.5.5 0 0 1 1 .01.5.5 0 0 1-.5.49m.5-9l-9 9 1.51 1.5 9-9zm-5-2c2.2 0 4-1.12 4-2.5V2s.98-.16 1.5.95C23 4.05 23 6 23 6s1-1.12 1-3.13C24-.02 21 0 21 0h-2v6.35A5.85 5.85 0 0 0 17 6c-2.2 0-4 1.12-4 2.5s1.8 2.5 4 2.5m-6.7 9.48L8.82 18.9a47.54 47.54 0 0 1-1.44 1.13c-.3-.3-.99-1.02-2.04-2.19.9-.83 1.47-1.46 1.72-1.89s.38-.87.38-1.33c0-.6-.27-1.18-.82-1.76-.54-.58-1.33-.87-2.35-.87-1 0-1.79.29-2.34.87-.56.6-.83 1.18-.83 1.79 0 .81.42 1.75 1.25 2.8a6.57 6.57 0 0 0-1.8 1.79 3.46 3.46 0 0 0-.51 1.83c0 .86.3 1.56.92 2.1a3.5 3.5 0 0 0 2.42.83c1.17 0 2.44-.38 3.81-1.14L8.23 24h2.82l-2.09-2.38 1.34-1.14zM3.56 14.1a1.02 1.02 0 0 1 .73-.28c.31 0 .56.08.75.25a.85.85 0 0 1 .28.66c0 .52-.42 1.11-1.26 1.78-.53-.65-.8-1.23-.8-1.74a.9.9 0 0 1 .3-.67m.18 7.9c-.43 0-.78-.12-1.06-.35-.28-.23-.41-.49-.41-.76 0-.6.5-1.3 1.52-2.09a31.23 31.23 0 0 0 2.25 2.44c-.92.5-1.69.76-2.3.76`,
};
const search = {
  search: `M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z`,
  delete: `M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z`,
};

const I18N = {
  search: "Search",
  emojilist: "List of emoji",
  notfound: "No Emoji Found",
  clear: "Clear",
  categories: {
    search: "Search Results",
    recent: "Frequently Used",
    people: "Smileys & People",
    nature: "Animals & Nature",
    foods: "Food & Drink",
    activity: "Activity",
    places: "Travel & Places",
    objects: "Objects",
    symbols: "Symbols",
    flags: "Flags",
    custom: "Custom",
  },
  skintones: {
    1: "Default Skin Tone",
    2: "Light Skin Tone",
    3: "Medium-Light Skin Tone",
    4: "Medium Skin Tone",
    5: "Medium-Dark Skin Tone",
    6: "Dark Skin Tone",
  },
};
class PickerComponent {
  constructor(ref, frequently) {
    this.ref = ref;
    this.frequently = frequently;
    this.perLine = 9;
    this.totalFrequentLines = 4;
    this.i18n = {};
    this.style = {};
    this.title = "Emoji Mart™";
    this.emoji = "department_store";
    this.darkMode = !!(
      typeof matchMedia === "function" &&
      matchMedia("(prefers-color-scheme: dark)").matches
    );
    this.color = "#ae65c5";
    this.hideObsolete = true;
    /** all categories shown */
    this.categories = [];
    /** used to temporarily draw categories */
    this.activeCategories = [];
    this.set = "apple";
    this.skin = 1;
    /** Renders the native unicode emoji */
    this.isNative = false;
    this.emojiSize = 24;
    this.sheetSize = 64;
    this.showPreview = true;
    this.emojiTooltip = false;
    this.autoFocus = false;
    this.custom = [];
    this.hideRecent = true;
    this.notFoundEmoji = "sleuth_or_spy";
    this.categoriesIcons = categories;
    this.searchIcons = search;
    this.useButton = false;
    this.enableFrequentEmojiSort = false;
    this.enableSearch = true;
    this.showSingleCategory = false;
    this.emojiClick = new EventEmitter();
    this.emojiSelect = new EventEmitter();
    this.skinChange = new EventEmitter();
    this.scrollHeight = 0;
    this.clientHeight = 0;
    this.firstRender = true;
    this.NAMESPACE = "emoji-mart";
    this.measureScrollbar = 0;
    this.RECENT_CATEGORY = {
      id: "recent",
      name: "Recent",
      emojis: null,
    };
    this.SEARCH_CATEGORY = {
      id: "search",
      name: "Search",
      emojis: null,
      anchor: false,
    };
    this.CUSTOM_CATEGORY = {
      id: "custom",
      name: "Custom",
      emojis: [],
    };
    this.backgroundImageFn = (set, sheetSize) => `/assets/emoji/64.png`;
  }
  ngOnInit() {
    // measure scroll
    this.measureScrollbar = measureScrollbar();
    this.i18n = Object.assign(Object.assign({}, I18N), this.i18n);
    this.i18n.categories = Object.assign(
      Object.assign({}, I18N.categories),
      this.i18n.categories
    );
    this.skin =
      JSON.parse(localStorage.getItem(`${this.NAMESPACE}.skin`) || "null") ||
      this.skin;
    const allCategories = [...categories$1];
    if (this.custom.length > 0) {
      this.CUSTOM_CATEGORY.emojis = this.custom.map((emoji) => {
        return Object.assign(Object.assign({}, emoji), {
          // `<Category />` expects emoji to have an `id`.
          id: emoji.shortNames[0],
          custom: true,
        });
      });
      allCategories.push(this.CUSTOM_CATEGORY);
    }
    if (this.include !== undefined) {
      allCategories.sort((a, b) => {
        if (this.include.indexOf(a.id) > this.include.indexOf(b.id)) {
          return 1;
        }
        return -1;
      });
    }
    for (const category of allCategories) {
      const isIncluded =
        this.include && this.include.length
          ? this.include.indexOf(category.id) > -1
          : true;
      const isExcluded =
        this.exclude && this.exclude.length
          ? this.exclude.indexOf(category.id) > -1
          : false;
      if (!isIncluded || isExcluded) {
        continue;
      }
      if (this.emojisToShowFilter) {
        const newEmojis = [];
        const { emojis } = category;
        // tslint:disable-next-line: prefer-for-of
        for (let emojiIndex = 0; emojiIndex < emojis.length; emojiIndex++) {
          const emoji = emojis[emojiIndex];
          if (this.emojisToShowFilter(emoji)) {
            newEmojis.push(emoji);
          }
        }
        if (newEmojis.length) {
          const newCategory = {
            emojis: newEmojis,
            name: category.name,
            id: category.id,
          };
          this.categories.push(newCategory);
        }
      } else {
        this.categories.push(category);
      }
      this.categoriesIcons = Object.assign(
        Object.assign({}, categories),
        this.categoriesIcons
      );
      this.searchIcons = Object.assign(
        Object.assign({}, search),
        this.searchIcons
      );
    }
    const includeRecent =
      this.include && this.include.length
        ? this.include.indexOf(this.RECENT_CATEGORY.id) > -1
        : true;
    const excludeRecent =
      this.exclude && this.exclude.length
        ? this.exclude.indexOf(this.RECENT_CATEGORY.id) > -1
        : false;
    if (includeRecent && !excludeRecent) {
      this.hideRecent = false;
      this.categories.unshift(this.RECENT_CATEGORY);
    }
    if (this.categories[0]) {
      this.categories[0].first = true;
    }
    this.categories.unshift(this.SEARCH_CATEGORY);
    this.selected = this.categories.filter(
      (category) => category.first
    )[0].name;
    // Need to be careful if small number of categories
    const categoriesToLoadFirst = Math.min(this.categories.length, 3);
    this.setActiveCategories(
      (this.activeCategories = this.categories.slice(0, categoriesToLoadFirst))
    );
    // Trim last active category
    const lastActiveCategoryEmojis = this.categories[
      categoriesToLoadFirst - 1
    ].emojis.slice();
    this.categories[
      categoriesToLoadFirst - 1
    ].emojis = lastActiveCategoryEmojis.slice(0, 60);
    this.ref.markForCheck();
    setTimeout(() => {
      // Restore last category
      this.categories[
        categoriesToLoadFirst - 1
      ].emojis = lastActiveCategoryEmojis;
      this.setActiveCategories(this.categories);
      this.ref.markForCheck();
      setTimeout(() => this.updateCategoriesSize());
    });
  }
  setActiveCategories(categoriesToMakeActive) {
    if (this.showSingleCategory) {
      this.activeCategories = categoriesToMakeActive.filter(
        (x) => x.name === this.selected || x === this.SEARCH_CATEGORY
      );
    } else {
      this.activeCategories = categoriesToMakeActive;
    }
  }
  updateCategoriesSize() {
    this.categoryRefs.forEach((component) => component.memoizeSize());
    if (this.scrollRef) {
      const target = this.scrollRef.nativeElement;
      this.scrollHeight = target.scrollHeight;
      this.clientHeight = target.clientHeight;
    }
  }
  handleAnchorClick($event) {
    this.updateCategoriesSize();
    this.selected = $event.category.name;
    this.setActiveCategories(this.categories);
    if (this.SEARCH_CATEGORY.emojis) {
      this.handleSearch(null);
      this.searchRef.clear();
      this.handleAnchorClick($event);
      return;
    }
    const component = this.categoryRefs.find(
      (n) => n.id === $event.category.id
    );
    if (component) {
      let { top } = component;
      if ($event.category.first) {
        top = 0;
      } else {
        top += 1;
      }
      this.scrollRef.nativeElement.scrollTop = top;
    }
    this.selected = $event.category.name;
    this.nextScroll = $event.category.name;
  }
  categoryTrack(index, item) {
    return item.id;
  }
  handleScroll() {
    if (this.nextScroll) {
      this.selected = this.nextScroll;
      this.nextScroll = undefined;
      return;
    }
    if (!this.scrollRef) {
      return;
    }
    if (this.showSingleCategory) {
      return;
    }
    let activeCategory = null;
    if (this.SEARCH_CATEGORY.emojis) {
      activeCategory = this.SEARCH_CATEGORY;
    } else {
      const target = this.scrollRef.nativeElement;
      // check scroll is not at bottom
      if (target.scrollTop === 0) {
        // hit the TOP
        activeCategory = this.categories.find((n) => n.first === true);
      } else if (target.scrollHeight - target.scrollTop === this.clientHeight) {
        // scrolled to bottom activate last category
        activeCategory = this.categories[this.categories.length - 1];
      } else {
        // scrolling
        for (const category of this.categories) {
          const component = this.categoryRefs.find((n) => n.id === category.id);
          const active = component.handleScroll(target.scrollTop);
          if (active) {
            activeCategory = category;
          }
        }
      }
      this.scrollTop = target.scrollTop;
    }
    if (activeCategory) {
      this.selected = activeCategory.name;
    }
  }
  handleSearch($emojis) {
    this.SEARCH_CATEGORY.emojis = $emojis;
    for (const component of this.categoryRefs.toArray()) {
      if (component.name === "Search") {
        component.emojis = $emojis;
        component.updateDisplay($emojis ? "block" : "none");
      } else {
        component.updateDisplay($emojis ? "none" : "block");
      }
    }
    this.scrollRef.nativeElement.scrollTop = 0;
    this.handleScroll();
  }
  handleEnterKey($event, emoji) {
    if (!emoji) {
      if (
        this.SEARCH_CATEGORY.emojis !== null &&
        this.SEARCH_CATEGORY.emojis.length
      ) {
        emoji = this.SEARCH_CATEGORY.emojis[0];
        if (emoji) {
          this.emojiSelect.emit({ $event, emoji });
        } else {
          return;
        }
      }
    }
    if (!this.hideRecent && !this.recent && emoji) {
      this.frequently.add(emoji);
    }
    const component = this.categoryRefs.toArray()[1];
    if (component && this.enableFrequentEmojiSort) {
      component.getEmojis();
      component.ref.markForCheck();
    }
  }
  handleEmojiOver($event) {
    if (!this.showPreview || !this.previewRef) {
      return;
    }
    const emojiData = this.CUSTOM_CATEGORY.emojis.find(
      (customEmoji) => customEmoji.id === $event.emoji.id
    );
    if (emojiData) {
      $event.emoji = Object.assign({}, emojiData);
    }
    this.previewEmoji = $event.emoji;
    clearTimeout(this.leaveTimeout);
  }
  handleEmojiLeave() {
    if (!this.showPreview || !this.previewRef) {
      return;
    }
    this.leaveTimeout = setTimeout(() => {
      this.previewEmoji = null;
      this.previewRef.ref.markForCheck();
    }, 16);
  }
  handleEmojiClick($event) {
    this.emojiClick.emit($event);
    this.emojiSelect.emit($event);
    this.handleEnterKey($event.$event, $event.emoji);
  }
  handleSkinChange(skin) {
    this.skin = skin;
    localStorage.setItem(`${this.NAMESPACE}.skin`, String(skin));
    this.skinChange.emit(skin);
  }
  getWidth() {
    if (this.style && this.style.width) {
      return this.style.width;
    }
    return (
      this.perLine * (this.emojiSize + 12) +
      12 +
      2 +
      this.measureScrollbar +
      "px"
    );
  }
}
PickerComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: "emoji-mart",
        template:
          '<section class="emoji-mart {{ darkMode ? \'emoji-mart-dark\' : \'\' }}"\n  [style.width]="getWidth()"\n  [ngStyle]="style">\n  <div class="emoji-mart-bar">\n    <emoji-mart-anchors\n      [categories]="categories"\n      (anchorClick)="handleAnchorClick($event)"\n      [color]="color"\n      [selected]="selected"\n      [i18n]="i18n"\n      [icons]="categoriesIcons"\n    ></emoji-mart-anchors>\n  </div>\n  <emoji-search\n    *ngIf="enableSearch"\n    #searchRef\n    [i18n]="i18n"\n    (searchResults)="handleSearch($event)"\n    (enterKey)="handleEnterKey($event)"\n    [include]="include"\n    [exclude]="exclude"\n    [custom]="custom"\n    [autoFocus]="autoFocus"\n    [icons]="searchIcons"\n    [emojisToShowFilter]="emojisToShowFilter"\n  ></emoji-search>\n  <section #scrollRef class="emoji-mart-scroll" (scroll)="handleScroll()" [attr.aria-label]="i18n.emojilist">\n    <emoji-category\n      *ngFor="let category of activeCategories; let idx = index; trackBy: categoryTrack"\n      #categoryRef\n      [id]="category.id"\n      [name]="category.name"\n      [emojis]="category.emojis"\n      [perLine]="perLine"\n      [totalFrequentLines]="totalFrequentLines"\n      [hasStickyPosition]="isNative"\n      [i18n]="i18n"\n      [hideObsolete]="hideObsolete"\n      [notFoundEmoji]="notFoundEmoji"\n      [custom]="category.id == RECENT_CATEGORY.id ? CUSTOM_CATEGORY.emojis : undefined"\n      [recent]="category.id == RECENT_CATEGORY.id ? recent : undefined"\n      [emojiIsNative]="isNative"\n      [emojiSkin]="skin"\n      [emojiSize]="emojiSize"\n      [emojiSet]="set"\n      [emojiSheetSize]="sheetSize"\n      [emojiForceSize]="isNative"\n      [emojiTooltip]="emojiTooltip"\n      [emojiBackgroundImageFn]="backgroundImageFn"\n      [emojiUseButton]="false"\n      (emojiOver)="handleEmojiOver($event)"\n      (emojiLeave)="handleEmojiLeave()"\n      (emojiClick)="handleEmojiClick($event)"\n    ></emoji-category>\n  </section>\n  <div class="emoji-mart-bar" *ngIf="showPreview">\n    <emoji-preview\n      #previewRef\n      [title]="title"\n      [emoji]="previewEmoji"\n      [idleEmoji]="emoji"\n      [emojiIsNative]="isNative"\n      [emojiSize]="38"\n      [emojiSkin]="skin"\n      [emojiSet]="set"\n      [i18n]="i18n"\n      [emojiSheetSize]="sheetSize"\n      [emojiBackgroundImageFn]="backgroundImageFn"\n      (skinChange)="handleSkinChange($event)"\n    ></emoji-preview>\n  </div>\n</section>\n',
        changeDetection: ChangeDetectionStrategy.OnPush,
        preserveWhitespaces: false,
      },
    ],
  },
];
PickerComponent.ctorParameters = () => [
  { type: ChangeDetectorRef },
  { type: EmojiFrequentlyService },
];
PickerComponent.propDecorators = {
  perLine: [{ type: Input }],
  totalFrequentLines: [{ type: Input }],
  i18n: [{ type: Input }],
  style: [{ type: Input }],
  title: [{ type: Input }],
  emoji: [{ type: Input }],
  darkMode: [{ type: Input }],
  color: [{ type: Input }],
  hideObsolete: [{ type: Input }],
  categories: [{ type: Input }],
  activeCategories: [{ type: Input }],
  set: [{ type: Input }],
  skin: [{ type: Input }],
  isNative: [{ type: Input }],
  emojiSize: [{ type: Input }],
  sheetSize: [{ type: Input }],
  emojisToShowFilter: [{ type: Input }],
  showPreview: [{ type: Input }],
  emojiTooltip: [{ type: Input }],
  autoFocus: [{ type: Input }],
  custom: [{ type: Input }],
  hideRecent: [{ type: Input }],
  include: [{ type: Input }],
  exclude: [{ type: Input }],
  notFoundEmoji: [{ type: Input }],
  categoriesIcons: [{ type: Input }],
  searchIcons: [{ type: Input }],
  useButton: [{ type: Input }],
  enableFrequentEmojiSort: [{ type: Input }],
  enableSearch: [{ type: Input }],
  showSingleCategory: [{ type: Input }],
  emojiClick: [{ type: Output }],
  emojiSelect: [{ type: Output }],
  skinChange: [{ type: Output }],
  scrollRef: [{ type: ViewChild, args: ["scrollRef", { static: true }] }],
  previewRef: [{ type: ViewChild, args: ["previewRef"] }],
  searchRef: [{ type: ViewChild, args: ["searchRef", { static: true }] }],
  categoryRefs: [{ type: ViewChildren, args: ["categoryRef"] }],
  backgroundImageFn: [{ type: Input }],
};

class PreviewComponent {
  constructor(ref, emojiService) {
    this.ref = ref;
    this.emojiService = emojiService;
    this.skinChange = new EventEmitter();
    this.emojiData = {};
  }
  ngOnChanges() {
    if (!this.emoji) {
      return;
    }
    this.emojiData = this.emojiService.getData(
      this.emoji,
      this.emojiSkin,
      this.emojiSet
    );
    const knownEmoticons = [];
    const listedEmoticons = [];
    const emoitcons = this.emojiData.emoticons || [];
    emoitcons.forEach((emoticon) => {
      if (knownEmoticons.indexOf(emoticon.toLowerCase()) >= 0) {
        return;
      }
      knownEmoticons.push(emoticon.toLowerCase());
      listedEmoticons.push(emoticon);
    });
    this.listedEmoticons = listedEmoticons;
  }
}
PreviewComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: "emoji-preview",
        template: `
  <div class="emoji-mart-preview" *ngIf="emoji && emojiData">
    <div class="emoji-mart-preview-emoji">
      <ngx-emoji
        [emoji]="emoji"
        [size]="38"
        [isNative]="emojiIsNative"
        [skin]="emojiSkin"
        [size]="emojiSize"
        [set]="emojiSet"
        [sheetSize]="emojiSheetSize"
        [backgroundImageFn]="emojiBackgroundImageFn"
      ></ngx-emoji>
    </div>

    <div class="emoji-mart-preview-data">
      <div class="emoji-mart-preview-name">{{ emojiData.name }}</div>
      <div class="emoji-mart-preview-shortname">
        <span class="emoji-mart-preview-shortname" *ngFor="let short_name of emojiData.shortNames">
          :{{ short_name }}:
        </span>
      </div>
      <div class="emoji-mart-preview-emoticons">
        <span class="emoji-mart-preview-emoticon" *ngFor="let emoticon of listedEmoticons">
          {{ emoticon }}
        </span>
      </div>
    </div>
  </div>

  <div class="emoji-mart-preview" *ngIf="!emoji">
    <div class="emoji-mart-preview-emoji">
      <ngx-emoji *ngIf="idleEmoji && idleEmoji.length"
        [isNative]="emojiIsNative"
        [skin]="emojiSkin"
        [set]="emojiSet"
        [emoji]="idleEmoji"
        [backgroundImageFn]="emojiBackgroundImageFn"
        [size]="38"
      ></ngx-emoji>
    </div>

    <div class="emoji-mart-preview-data">
      <span class="emoji-mart-title-label">{{ title }}</span>
    </div>

    <div class="emoji-mart-preview-skins">
      <emoji-skins [skin]="emojiSkin" (changeSkin)="skinChange.emit($event)" [i18n]="i18n">
      </emoji-skins>
    </div>
  </div>
  `,
        changeDetection: ChangeDetectionStrategy.OnPush,
        preserveWhitespaces: false,
      },
    ],
  },
];
PreviewComponent.ctorParameters = () => [
  { type: ChangeDetectorRef },
  { type: EmojiService },
];
PreviewComponent.propDecorators = {
  title: [{ type: Input }],
  emoji: [{ type: Input }],
  idleEmoji: [{ type: Input }],
  i18n: [{ type: Input }],
  emojiIsNative: [{ type: Input }],
  emojiSkin: [{ type: Input }],
  emojiSize: [{ type: Input }],
  emojiSet: [{ type: Input }],
  emojiSheetSize: [{ type: Input }],
  emojiBackgroundImageFn: [{ type: Input }],
  skinChange: [{ type: Output }],
};

let id = 0;
class SearchComponent {
  constructor(emojiSearch) {
    this.emojiSearch = emojiSearch;
    this.maxResults = 75;
    this.autoFocus = false;
    this.include = [];
    this.exclude = [];
    this.custom = [];
    this.searchResults = new EventEmitter();
    this.enterKey = new EventEmitter();
    this.isSearching = false;
    this.query = "";
    this.inputId = `emoji-mart-search-${++id}`;
  }
  ngOnInit() {
    this.icon = this.icons.search;
  }
  ngAfterViewInit() {
    if (this.autoFocus) {
      this.inputRef.nativeElement.focus();
    }
  }
  clear() {
    this.query = "";
    this.handleSearch("");
    this.inputRef.nativeElement.focus();
  }
  handleEnterKey($event) {
    if (!this.query) {
      return;
    }
    this.enterKey.emit($event);
    $event.preventDefault();
  }
  handleSearch(value) {
    if (value === "") {
      this.icon = this.icons.search;
      this.isSearching = false;
    } else {
      this.icon = this.icons.delete;
      this.isSearching = true;
    }
    const emojis = this.emojiSearch.search(
      this.query,
      this.emojisToShowFilter,
      this.maxResults,
      this.include,
      this.exclude,
      this.custom
    );
    this.searchResults.emit(emojis);
  }
  handleChange() {
    this.handleSearch(this.query);
  }
}
SearchComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: "emoji-search",
        template: `
    <div class="emoji-mart-search">
      <input
        [id]="inputId"
        #inputRef
        type="search"
        (keyup.enter)="handleEnterKey($event)"
        [placeholder]="i18n.search"
        [autofocus]="autoFocus"
        [(ngModel)]="query"
        (ngModelChange)="handleChange()"
      />
      <!--
      Use a <label> in addition to the placeholder for accessibility, but place it off-screen
      http://www.maxability.co.in/2016/01/placeholder-attribute-and-why-it-is-not-accessible/
      -->
      <label class="emoji-mart-sr-only" [htmlFor]="inputId">
        {{ i18n.search }}
      </label>
      <button
        type="button"
        class="emoji-mart-search-icon"
        (click)="clear()"
        (keyup.enter)="clear()"
        [disabled]="!isSearching"
        [attr.aria-label]="i18n.clear"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          width="13"
          height="13"
          opacity="0.5"
        >
          <path [attr.d]="icon" />
        </svg>
      </button>
    </div>
  `,
        preserveWhitespaces: false,
      },
    ],
  },
];
SearchComponent.ctorParameters = () => [{ type: EmojiSearch }];
SearchComponent.propDecorators = {
  maxResults: [{ type: Input }],
  autoFocus: [{ type: Input }],
  i18n: [{ type: Input }],
  include: [{ type: Input }],
  exclude: [{ type: Input }],
  custom: [{ type: Input }],
  icons: [{ type: Input }],
  emojisToShowFilter: [{ type: Input }],
  searchResults: [{ type: Output }],
  enterKey: [{ type: Output }],
  inputRef: [{ type: ViewChild, args: ["inputRef", { static: true }] }],
};

class SkinComponent {
  constructor() {
    this.changeSkin = new EventEmitter();
    this.opened = false;
    this.skinTones = [1, 2, 3, 4, 5, 6];
  }
  toggleOpen() {
    this.opened = !this.opened;
  }
  isSelected(skinTone) {
    return skinTone === this.skin;
  }
  isVisible(skinTone) {
    return this.opened || this.isSelected(skinTone);
  }
  pressed(skinTone) {
    return this.opened ? !!this.isSelected(skinTone) : "";
  }
  tabIndex(skinTone) {
    return this.isVisible(skinTone) ? "0" : "";
  }
  expanded(skinTone) {
    return this.isSelected(skinTone) ? this.opened : "";
  }
  handleClick(skin) {
    if (!this.opened) {
      this.opened = true;
      return;
    }
    this.opened = false;
    if (skin !== this.skin) {
      this.changeSkin.emit(skin);
    }
  }
}
SkinComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: "emoji-skins",
        template: `
    <section
      class="emoji-mart-skin-swatches"
      [class.opened]="opened"
    >
      <span
        *ngFor="let skinTone of skinTones"
        class="emoji-mart-skin-swatch"
        [class.selected]="skinTone === skin"
      >
        <span
          (click)="this.handleClick(skinTone)"
          (keyup.enter)="handleClick(skinTone)"
          (keyup.space)="handleClick(skinTone)"
          class="emoji-mart-skin emoji-mart-skin-tone-{{ skinTone }}"
          role="button"
          [tabIndex]="tabIndex(skinTone)"
          [attr.aria-hidden]="!isVisible(skinTone)"
          [attr.aria-pressed]="pressed(skinTone)"
          [attr.aria-haspopup]="!!isSelected(skinTone)"
          [attr.aria-expanded]="expanded(skinTone)"
          [attr.aria-label]="i18n.skintones[skinTone]"
          [title]="i18n.skintones[skinTone]"
        ></span>
      </span>
    </section>
  `,
        changeDetection: ChangeDetectionStrategy.OnPush,
        preserveWhitespaces: false,
      },
    ],
  },
];
SkinComponent.propDecorators = {
  skin: [{ type: Input }],
  i18n: [{ type: Input }],
  changeSkin: [{ type: Output }],
};

class PickerModule {}
PickerModule.decorators = [
  {
    type: NgModule,
    args: [
      {
        imports: [CommonModule, FormsModule, EmojiModule],
        exports: [
          PickerComponent,
          AnchorsComponent,
          CategoryComponent,
          SearchComponent,
          PreviewComponent,
          SkinComponent,
        ],
        declarations: [
          PickerComponent,
          AnchorsComponent,
          CategoryComponent,
          SearchComponent,
          PreviewComponent,
          SkinComponent,
        ],
      },
    ],
  },
];

/**
 * Generated bundle index. Do not edit.
 */

export {
  AnchorsComponent,
  CategoryComponent,
  EmojiFrequentlyService,
  EmojiSearch,
  PickerComponent,
  PickerModule,
  PreviewComponent,
  SearchComponent,
  SkinComponent,
};
//# sourceMappingURL=ctrl-ngx-emoji-mart.js.map
