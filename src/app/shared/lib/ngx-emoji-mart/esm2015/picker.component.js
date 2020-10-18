import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { categories } from "@shared/lib/ngx-emoji-mart/ngx-emoji";
import { EmojiFrequentlyService } from "./emoji-frequently.service";
import * as icons from "./svgs";
import { measureScrollbar } from "./utils";
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
export class PickerComponent {
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
    this.categoriesIcons = icons.categories;
    this.searchIcons = icons.search;
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
    const allCategories = [...categories];
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
        Object.assign({}, icons.categories),
        this.categoriesIcons
      );
      this.searchIcons = Object.assign(
        Object.assign({}, icons.search),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlja2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvcGlja2VyL3BpY2tlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUVULFlBQVksRUFDWixLQUFLLEVBRUwsTUFBTSxFQUVOLFNBQVMsRUFDVCxZQUFZLEdBQ2IsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUNMLFVBQVUsR0FLWCxNQUFNLGdDQUFnQyxDQUFDO0FBRXhDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBR3BFLE9BQU8sS0FBSyxLQUFLLE1BQU0sUUFBUSxDQUFDO0FBQ2hDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUkzQyxNQUFNLElBQUksR0FBUTtJQUNoQixNQUFNLEVBQUUsUUFBUTtJQUNoQixTQUFTLEVBQUUsZUFBZTtJQUMxQixRQUFRLEVBQUUsZ0JBQWdCO0lBQzFCLEtBQUssRUFBRSxPQUFPO0lBQ2QsVUFBVSxFQUFFO1FBQ1YsTUFBTSxFQUFFLGdCQUFnQjtRQUN4QixNQUFNLEVBQUUsaUJBQWlCO1FBQ3pCLE1BQU0sRUFBRSxrQkFBa0I7UUFDMUIsTUFBTSxFQUFFLGtCQUFrQjtRQUMxQixLQUFLLEVBQUUsY0FBYztRQUNyQixRQUFRLEVBQUUsVUFBVTtRQUNwQixNQUFNLEVBQUUsaUJBQWlCO1FBQ3pCLE9BQU8sRUFBRSxTQUFTO1FBQ2xCLE9BQU8sRUFBRSxTQUFTO1FBQ2xCLEtBQUssRUFBRSxPQUFPO1FBQ2QsTUFBTSxFQUFFLFFBQVE7S0FDakI7SUFDRCxTQUFTLEVBQUU7UUFDVCxDQUFDLEVBQUUsbUJBQW1CO1FBQ3RCLENBQUMsRUFBRSxpQkFBaUI7UUFDcEIsQ0FBQyxFQUFFLHdCQUF3QjtRQUMzQixDQUFDLEVBQUUsa0JBQWtCO1FBQ3JCLENB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b0JWLHNCQUFzQjs7O3NCQTJDNUIsS0FBSztpQ0FDTCxLQUFLO21CQUNMLEtBQUs7b0JBQ0wsS0FBSztvQkFDTCxLQUFLO29CQUNMLEtBQUs7dUJBQ0wsS0FBSztvQkFJTCxLQUFLOzJCQUNMLEtBQUs7eUJBRUwsS0FBSzsrQkFFTCxLQUFLO2tCQUNMLEtBQUs7bUJBQ0wsS0FBSzt1QkFFTCxLQUFLO3dCQUNMLEtBQUs7d0JBQ0wsS0FBSztpQ0FDTCxLQUFLOzBCQUNMLEtBQUs7MkJBQ0wsS0FBSzt3QkFDTCxLQUFLO3FCQUNMLEtBQUs7eUJBQ0wsS0FBSztzQkFDTCxLQUFLO3NCQUNMLEtBQUs7NEJBQ0wsS0FBSzs4QkFDTCxLQUFLOzBCQUNMLEtBQUs7d0JBQ0wsS0FBSztzQ0FDTCxLQUFLOzJCQUNMLEtBQUs7aUNBQ0wsS0FBSzt5QkFDTCxNQUFNOzBCQUNOLE1BQU07eUJBQ04sTUFBTTt3QkFDTixTQUFTLFNBQUMsV0FBVyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTt5QkFDdkMsU0FBUyxTQUFDLFlBQVk7d0JBQ3RCLFNBQVMsU0FBQyxXQUFXLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFOzJCQUN2QyxZQUFZLFNBQUMsYUFBYTtnQ0E2QjFCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0NoaWxkLFxuICBWaWV3Q2hpbGRyZW4sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge1xuICBjYXRlZ29yaWVzLFxuICBFbW9qaSxcbiAgRW1vamlDYXRlZ29yeSxcbiAgRW1vamlEYXRhLFxuICBFbW9qaUV2ZW50LFxufSBmcm9tICdAY3RybC9uZ3gtZW1vamktbWFydC9uZ3gtZW1vamknO1xuaW1wb3J0IHsgQ2F0ZWdvcnlDb21wb25lbnQgfSBmcm9tICcuL2NhdGVnb3J5LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBFbW9qaUZyZXF1ZW50bHlTZXJ2aWNlIH0gZnJvbSAnLi9lbW9qaS1mcmVxdWVudGx5LnNlcnZpY2UnO1xuaW1wb3J0IHsgUHJldmlld0NvbXBvbmVudCB9IGZyb20gJy4vcHJldmlldy5jb21wb25lbnQnO1xuaW1wb3J0IHsgU2VhcmNoQ29tcG9uZW50IH0gZnJvbSAnLi9zZWFyY2guY29tcG9uZW50JztcbmltcG9ydCAqIGFzIGljb25zIGZyb20gJy4vc3Zncyc7XG5pbXBvcnQgeyBtZWFzdXJlU2Nyb2xsYmFyIH0gZnJvbSAnLi91dGlscyc7XG5cblxuXG5jb25zdCBJMThOOiBhbnkgPSB7XG4gIHNlYXJjaDogJ1NlYXJjaCcsXG4gIGVtb2ppbGlzdDogJ0xpc3Qgb2YgZW1vamknLFxuICBub3Rmb3VuZDogJ05vIEVtb2ppIEZvdW5kJyxcbiAgY2xlYXI6ICdDbGVhcicsXG4gIGNhdGVnb3JpZXM6IHtcbiAgICBzZWFyY2g6ICdTZWFyY2ggUmVzdWx0cycsXG4gICAgcmVjZW50OiAnRnJlcXVlbnRseSBVc2VkJyxcbiAgICBwZW9wbGU6ICdTbWlsZXlzICYgUGVvcGxlJyxcbiAgICBuYXR1cmU6ICdBbmltYWxzICYgTmF0dXJlJyxcbiAgICBmb29kczogJ0Zvb2QgJiBEcmluaycsXG4gICAgYWN0aXZpdHk6ICdBY3Rpdml0eScsXG4gICAgcGxhY2VzOiAnVHJhdmVsICYgUGxhY2VzJyxcbiAgICBvYmplY3RzOiAnT2JqZWN0cycsXG4gICAgc3ltYm9sczogJ1N5bWJvbHMnLFxuICAgIGZsYWdzOiAnRmxhZ3MnLFxuICAgIGN1c3RvbTogJ0N1c3RvbScsXG4gIH0sXG4gIHNraW50b25lczoge1xuICAgIDE6ICdEZWZhdWx0IFNraW4gVG9uZScsXG4gICAgMjogJ0xpZ2h0IFNraW4gVG9uZScsXG4gICAgMzogJ01lZGl1bS1MaWdodCBTa2luIFRvbmUnLFxuICAgIDQ6ICdNZWRpdW0gU2tpbiBUb25lJyxcbiAgICA1OiAnTWVkaXVtLURhcmsgU2tpbiBUb25lJyxcbiAgICA2OiAnRGFyayBTa2luIFRvbmUnLFxuICB9LFxufTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZW1vamktbWFydCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9waWNrZXIuY29tcG9uZW50Lmh0bWwnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXG59KVxuZXhwb3J0IGNsYXNzIFBpY2tlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBJbnB1dCgpIHBlckxpbmUgPSA5O1xuICBASW5wdXQoKSB0b3RhbEZyZXF1ZW50TGluZXMgPSA0O1xuICBASW5wdXQoKSBpMThuOiBhbnkgPSB7fTtcbiAgQElucHV0KCkgc3R5bGU6IGFueSA9IHt9O1xuICBASW5wdXQoKSB0aXRsZSA9ICdFbW9qaSBNYXJ04oSiJztcbiAgQElucHV0KCkgZW1vamkgPSAnZGVwYXJ0bWVudF9zdG9yZSc7XG4gIEBJbnB1dCgpIGRhcmtNb2RlID0gISEoXG4gICAgdHlwZW9mIG1hdGNoTWVkaWEgPT09ICdmdW5jdGlvbicgJiZcbiAgICBtYXRjaE1lZGlhKCcocHJlZmVycy1jb2xvci1zY2hlbWU6IGRhcmspJykubWF0Y2hlc1xuICApO1xuICBASW5wdXQoKSBjb2xvciA9ICcjYWU2NWM1JztcbiAgQElucHV0KCkgaGlkZU9ic29sZXRlID0gdHJ1ZTtcbiAgLyoqIGFsbCBjYXRlZ29yaWVzIHNob3duICovXG4gIEBJbnB1dCgpIGNhdGVnb3JpZXM6IEVtb2ppQ2F0ZWdvcnlbXSA9IFtdO1xuICAvKiogdXNlZCB0byB0ZW1wb3JhcmlseSBkcmF3IGNhdGVnb3JpZXMgKi9cbiAgQElucHV0KCkgYWN0aXZlQ2F0ZWdvcmllczogRW1vamlDYXRlZ29yeVtdID0gW107XG4gIEBJbnB1dCgpIHNldDogRW1vamlbJ3NldCddID0gJ2FwcGxlJztcbiAgQElucHV0KCkgc2tpbjogRW1vamlbJ3NraW4nXSA9IDE7XG4gIC8qKiBSZW5kZXJzIHRoZSBuYXRpdmUgdW5pY29kZSBlbW9qaSAqL1xuICBASW5wdXQoKSBpc05hdGl2ZTogRW1vamlbJ2lzTmF0aXZlJ10gPSBmYWxzZTtcbiAgQElucHV0KCkgZW1vamlTaXplOiBFbW9qaVsnc2l6ZSddID0gMjQ7XG4gIEBJbnB1dCgpIHNoZWV0U2l6ZTogRW1vamlbJ3NoZWV0U2l6ZSddID0gNjQ7XG4gIEBJbnB1dCgpIGVtb2ppc1RvU2hvd0ZpbHRlcj86ICh4OiBzdHJpbmcpID0+IGJvb2xlYW47XG4gIEBJbnB1dCgpIHNob3dQcmV2aWV3ID0gdHJ1ZTtcbiAgQElucHV0KCkgZW1vamlUb29sdGlwID0gZmFsc2U7XG4gIEBJbnB1dCgpIGF1dG9Gb2N1cyA9IGZhbHNlO1xuICBASW5wdXQoKSBjdXN0b206IGFueVtdID0gW107XG4gIEBJbnB1dCgpIGhpZGVSZWNlbnQgPSB0cnVlO1xuICBASW5wdXQoKSBpbmNsdWRlPzogc3RyaW5nW107XG4gIEBJbnB1dCgpIGV4Y2x1ZGU/OiBzdHJpbmdbXTtcbiAgQElucHV0KCkgbm90Rm91bmRFbW9qaSA9ICdzbGV1dGhfb3Jfc3B5JztcbiAgQElucHV0KCkgY2F0ZWdvcmllc0ljb25zID0gaWNvbnMuY2F0ZWdvcmllcztcbiAgQElucHV0KCkgc2VhcmNoSWNvbnMgPSBpY29ucy5zZWFyY2g7XG4gIEBJbnB1dCgpIHVzZUJ1dHRvbiA9IGZhbHNlO1xuICBASW5wdXQoKSBlbmFibGVGcmVxdWVudEVtb2ppU29ydCA9IGZhbHNlO1xuICBASW5wdXQoKSBlbmFibGVTZWFyY2ggPSB0cnVlO1xuICBASW5wdXQoKSBzaG93U2luZ2xlQ2F0ZWdvcnkgPSBmYWxzZTtcbiAgQE91dHB1dCgpIGVtb2ppQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIGVtb2ppU2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBza2luQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxFbW9qaVsnc2tpbiddPigpO1xuICBAVmlld0NoaWxkKCdzY3JvbGxSZWYnLCB7IHN0YXRpYzogdHJ1ZSB9KSBwcml2YXRlIHNjcm9sbFJlZiE6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ3ByZXZpZXdSZWYnKSBwcml2YXRlIHByZXZpZXdSZWYhOiBQcmV2aWV3Q29tcG9uZW50O1xuICBAVmlld0NoaWxkKCdzZWFyY2hSZWYnLCB7IHN0YXRpYzogdHJ1ZSB9KSBwcml2YXRlIHNlYXJjaFJlZiE6IFNlYXJjaENvbXBvbmVudDtcbiAgQFZpZXdDaGlsZHJlbignY2F0ZWdvcnlSZWYnKSBwcml2YXRlIGNhdGVnb3J5UmVmcyE6IFF1ZXJ5TGlzdDxDYXRlZ29yeUNvbXBvbmVudD47XG4gIHNjcm9sbEhlaWdodCA9IDA7XG4gIGNsaWVudEhlaWdodCA9IDA7XG4gIHNlbGVjdGVkPzogc3RyaW5nO1xuICBuZXh0U2Nyb2xsPzogc3RyaW5nO1xuICBzY3JvbGxUb3A/OiBudW1iZXI7XG4gIGZpcnN0UmVuZGVyID0gdHJ1ZTtcbiAgcmVjZW50Pzogc3RyaW5nW107XG4gIHByZXZpZXdFbW9qaTogYW55O1xuICBsZWF2ZVRpbWVvdXQ6IGFueTtcbiAgTkFNRVNQQUNFID0gJ2Vtb2ppLW1hcnQnO1xuICBtZWFzdXJlU2Nyb2xsYmFyID0gMDtcbiAgUkVDRU5UX0NBVEVHT1JZOiBFbW9qaUNhdGVnb3J5ID0ge1xuICAgIGlkOiAncmVjZW50JyxcbiAgICBuYW1lOiAnUmVjZW50JyxcbiAgICBlbW9qaXM6IG51bGwsXG4gIH07XG4gIFNFQVJDSF9DQVRFR09SWTogRW1vamlDYXRlZ29yeSA9IHtcbiAgICBpZDogJ3NlYXJjaCcsXG4gICAgbmFtZTogJ1NlYXJjaCcsXG4gICAgZW1vamlzOiBudWxsLFxuICAgIGFuY2hvcjogZmFsc2UsXG4gIH07XG4gIENVU1RPTV9DQVRFR09SWTogRW1vamlDYXRlZ29yeSA9IHtcbiAgICBpZDogJ2N1c3RvbScsXG4gICAgbmFtZTogJ0N1c3RvbScsXG4gICAgZW1vamlzOiBbXSxcbiAgfTtcblxuICBASW5wdXQoKVxuICBiYWNrZ3JvdW5kSW1hZ2VGbjogRW1vamlbJ2JhY2tncm91bmRJbWFnZUZuJ10gPSAoXG4gICAgc2V0OiBzdHJpbmcsXG4gICAgc2hlZXRTaXplOiBudW1iZXIsXG4gICkgPT5cbiAgICBgaHR0cHM6Ly91bnBrZy5jb20vZW1vamktZGF0YXNvdXJjZS0ke3RoaXMuc2V0fUA1LjAuMS9pbWcvJHt0aGlzLnNldH0vc2hlZXRzLTI1Ni8ke3RoaXMuc2hlZXRTaXplfS5wbmdgXG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgZnJlcXVlbnRseTogRW1vamlGcmVxdWVudGx5U2VydmljZSxcbiAgKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vIG1lYXN1cmUgc2Nyb2xsXG4gICAgdGhpcy5tZWFzdXJlU2Nyb2xsYmFyID0gbWVhc3VyZVNjcm9sbGJhcigpO1xuXG4gICAgdGhpcy5pMThuID0geyAuLi5JMThOLCAuLi50aGlzLmkxOG4gfTtcbiAgICB0aGlzLmkxOG4uY2F0ZWdvcmllcyA9IHsgLi4uSTE4Ti5jYXRlZ29yaWVzLCAuLi50aGlzLmkxOG4uY2F0ZWdvcmllcyB9O1xuICAgIHRoaXMuc2tpbiA9XG4gICAgICBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGAke3RoaXMuTkFNRVNQQUNFfS5za2luYCkgfHwgJ251bGwnKSB8fFxuICAgICAgdGhpcy5za2luO1xuXG4gICAgY29uc3QgYWxsQ2F0ZWdvcmllcyA9IFsuLi5jYXRlZ29yaWVzXTtcblxuICAgIGlmICh0aGlzLmN1c3RvbS5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLkNVU1RPTV9DQVRFR09SWS5lbW9qaXMgPSB0aGlzLmN1c3RvbS5tYXAoZW1vamkgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLmVtb2ppLFxuICAgICAgICAgIC8vIGA8Q2F0ZWdvcnkgLz5gIGV4cGVjdHMgZW1vamkgdG8gaGF2ZSBhbiBgaWRgLlxuICAgICAgICAgIGlkOiBlbW9qaS5zaG9ydE5hbWVzWzBdLFxuICAgICAgICAgIGN1c3RvbTogdHJ1ZSxcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuXG4gICAgICBhbGxDYXRlZ29yaWVzLnB1c2godGhpcy5DVVNUT01fQ0FURUdPUlkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmluY2x1ZGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgYWxsQ2F0ZWdvcmllcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluY2x1ZGUhLmluZGV4T2YoYS5pZCkgPiB0aGlzLmluY2x1ZGUhLmluZGV4T2YoYi5pZCkpIHtcbiAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGNhdGVnb3J5IG9mIGFsbENhdGVnb3JpZXMpIHtcbiAgICAgIGNvbnN0IGlzSW5jbHVkZWQgPVxuICAgICAgICB0aGlzLmluY2x1ZGUgJiYgdGhpcy5pbmNsdWRlLmxlbmd0aFxuICAgICAgICAgID8gdGhpcy5pbmNsdWRlLmluZGV4T2YoY2F0ZWdvcnkuaWQpID4gLTFcbiAgICAgICAgICA6IHRydWU7XG4gICAgICBjb25zdCBpc0V4Y2x1ZGVkID1cbiAgICAgICAgdGhpcy5leGNsdWRlICYmIHRoaXMuZXhjbHVkZS5sZW5ndGhcbiAgICAgICAgICA/IHRoaXMuZXhjbHVkZS5pbmRleE9mKGNhdGVnb3J5LmlkKSA+IC0xXG4gICAgICAgICAgOiBmYWxzZTtcbiAgICAgIGlmICghaXNJbmNsdWRlZCB8fCBpc0V4Y2x1ZGVkKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5lbW9qaXNUb1Nob3dGaWx0ZXIpIHtcbiAgICAgICAgY29uc3QgbmV3RW1vamlzID0gW107XG5cbiAgICAgICAgY29uc3QgeyBlbW9qaXMgfSA9IGNhdGVnb3J5O1xuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IHByZWZlci1mb3Itb2ZcbiAgICAgICAgZm9yIChsZXQgZW1vamlJbmRleCA9IDA7IGVtb2ppSW5kZXggPCBlbW9qaXMhLmxlbmd0aDsgZW1vamlJbmRleCsrKSB7XG4gICAgICAgICAgY29uc3QgZW1vamkgPSBlbW9qaXMhW2Vtb2ppSW5kZXhdO1xuICAgICAgICAgIGlmICh0aGlzLmVtb2ppc1RvU2hvd0ZpbHRlcihlbW9qaSkpIHtcbiAgICAgICAgICAgIG5ld0Vtb2ppcy5wdXNoKGVtb2ppKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmV3RW1vamlzLmxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IG5ld0NhdGVnb3J5ID0ge1xuICAgICAgICAgICAgZW1vamlzOiBuZXdFbW9qaXMsXG4gICAgICAgICAgICBuYW1lOiBjYXRlZ29yeS5uYW1lLFxuICAgICAgICAgICAgaWQ6IGNhdGVnb3J5LmlkLFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICB0aGlzLmNhdGVnb3JpZXMucHVzaChuZXdDYXRlZ29yeSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY2F0ZWdvcmllcy5wdXNoKGNhdGVnb3J5KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jYXRlZ29yaWVzSWNvbnMgPSB7IC4uLmljb25zLmNhdGVnb3JpZXMsIC4uLnRoaXMuY2F0ZWdvcmllc0ljb25zIH07XG4gICAgICB0aGlzLnNlYXJjaEljb25zID0geyAuLi5pY29ucy5zZWFyY2gsIC4uLnRoaXMuc2VhcmNoSWNvbnMgfTtcbiAgICB9XG5cbiAgICBjb25zdCBpbmNsdWRlUmVjZW50ID1cbiAgICAgIHRoaXMuaW5jbHVkZSAmJiB0aGlzLmluY2x1ZGUubGVuZ3RoXG4gICAgICAgID8gdGhpcy5pbmNsdWRlLmluZGV4T2YodGhpcy5SRUNFTlRfQ0FURUdPUlkuaWQpID4gLTFcbiAgICAgICAgOiB0cnVlO1xuICAgIGNvbnN0IGV4Y2x1ZGVSZWNlbnQgPVxuICAgICAgdGhpcy5leGNsdWRlICYmIHRoaXMuZXhjbHVkZS5sZW5ndGhcbiAgICAgICAgPyB0aGlzLmV4Y2x1ZGUuaW5kZXhPZih0aGlzLlJFQ0VOVF9DQVRFR09SWS5pZCkgPiAtMVxuICAgICAgICA6IGZhbHNlO1xuICAgIGlmIChpbmNsdWRlUmVjZW50ICYmICFleGNsdWRlUmVjZW50KSB7XG4gICAgICB0aGlzLmhpZGVSZWNlbnQgPSBmYWxzZTtcbiAgICAgIHRoaXMuY2F0ZWdvcmllcy51bnNoaWZ0KHRoaXMuUkVDRU5UX0NBVEVHT1JZKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jYXRlZ29yaWVzWzBdKSB7XG4gICAgICB0aGlzLmNhdGVnb3JpZXNbMF0uZmlyc3QgPSB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMuY2F0ZWdvcmllcy51bnNoaWZ0KHRoaXMuU0VBUkNIX0NBVEVHT1JZKTtcbiAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy5jYXRlZ29yaWVzLmZpbHRlcihjYXRlZ29yeSA9PiBjYXRlZ29yeS5maXJzdClbMF0ubmFtZTtcblxuICAgIC8vIE5lZWQgdG8gYmUgY2FyZWZ1bCBpZiBzbWFsbCBudW1iZXIgb2YgY2F0ZWdvcmllc1xuICAgIGNvbnN0IGNhdGVnb3JpZXNUb0xvYWRGaXJzdCA9IE1hdGgubWluKHRoaXMuY2F0ZWdvcmllcy5sZW5ndGgsIDMpO1xuICAgIHRoaXMuc2V0QWN0aXZlQ2F0ZWdvcmllcyh0aGlzLmFjdGl2ZUNhdGVnb3JpZXMgPSB0aGlzLmNhdGVnb3JpZXMuc2xpY2UoMCwgY2F0ZWdvcmllc1RvTG9hZEZpcnN0KSk7XG5cbiAgICAvLyBUcmltIGxhc3QgYWN0aXZlIGNhdGVnb3J5XG4gICAgY29uc3QgbGFzdEFjdGl2ZUNhdGVnb3J5RW1vamlzID0gdGhpcy5jYXRlZ29yaWVzW2NhdGVnb3JpZXNUb0xvYWRGaXJzdCAtIDFdLmVtb2ppcyEuc2xpY2UoKTtcbiAgICB0aGlzLmNhdGVnb3JpZXNbY2F0ZWdvcmllc1RvTG9hZEZpcnN0IC0gMV0uZW1vamlzID0gbGFzdEFjdGl2ZUNhdGVnb3J5RW1vamlzLnNsaWNlKDAsIDYwKTtcblxuICAgIHRoaXMucmVmLm1hcmtGb3JDaGVjaygpO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAvLyBSZXN0b3JlIGxhc3QgY2F0ZWdvcnlcbiAgICAgIHRoaXMuY2F0ZWdvcmllc1tjYXRlZ29yaWVzVG9Mb2FkRmlyc3QgLSAxXS5lbW9qaXMgPSBsYXN0QWN0aXZlQ2F0ZWdvcnlFbW9qaXM7XG4gICAgICB0aGlzLnNldEFjdGl2ZUNhdGVnb3JpZXModGhpcy5jYXRlZ29yaWVzKTtcbiAgICAgIHRoaXMucmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnVwZGF0ZUNhdGVnb3JpZXNTaXplKCkpO1xuICAgIH0pO1xuICB9XG4gIHNldEFjdGl2ZUNhdGVnb3JpZXMoY2F0ZWdvcmllc1RvTWFrZUFjdGl2ZTogQXJyYXk8RW1vamlDYXRlZ29yeT4pIHtcbiAgICBpZiAodGhpcy5zaG93U2luZ2xlQ2F0ZWdvcnkpIHtcbiAgICAgIHRoaXMuYWN0aXZlQ2F0ZWdvcmllcyA9IGNhdGVnb3JpZXNUb01ha2VBY3RpdmUuZmlsdGVyKFxuICAgICAgICB4ID0+ICh4Lm5hbWUgPT09IHRoaXMuc2VsZWN0ZWQgfHwgeCA9PT0gdGhpcy5TRUFSQ0hfQ0FURUdPUlkpXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFjdGl2ZUNhdGVnb3JpZXMgPSBjYXRlZ29yaWVzVG9NYWtlQWN0aXZlO1xuICAgIH1cbiAgfVxuICB1cGRhdGVDYXRlZ29yaWVzU2l6ZSgpIHtcbiAgICB0aGlzLmNhdGVnb3J5UmVmcy5mb3JFYWNoKGNvbXBvbmVudCA9PiBjb21wb25lbnQubWVtb2l6ZVNpemUoKSk7XG5cbiAgICBpZiAodGhpcy5zY3JvbGxSZWYpIHtcbiAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuc2Nyb2xsUmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICB0aGlzLnNjcm9sbEhlaWdodCA9IHRhcmdldC5zY3JvbGxIZWlnaHQ7XG4gICAgICB0aGlzLmNsaWVudEhlaWdodCA9IHRhcmdldC5jbGllbnRIZWlnaHQ7XG4gICAgfVxuICB9XG4gIGhhbmRsZUFuY2hvckNsaWNrKCRldmVudDogeyBjYXRlZ29yeTogRW1vamlDYXRlZ29yeTsgaW5kZXg6IG51bWJlciB9KSB7XG4gICAgdGhpcy51cGRhdGVDYXRlZ29yaWVzU2l6ZSgpO1xuICAgIHRoaXMuc2VsZWN0ZWQgPSAkZXZlbnQuY2F0ZWdvcnkubmFtZTtcbiAgICB0aGlzLnNldEFjdGl2ZUNhdGVnb3JpZXModGhpcy5jYXRlZ29yaWVzKTtcblxuICAgIGlmICh0aGlzLlNFQVJDSF9DQVRFR09SWS5lbW9qaXMpIHtcbiAgICAgIHRoaXMuaGFuZGxlU2VhcmNoKG51bGwpO1xuICAgICAgdGhpcy5zZWFyY2hSZWYuY2xlYXIoKTtcbiAgICAgIHRoaXMuaGFuZGxlQW5jaG9yQ2xpY2soJGV2ZW50KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjb21wb25lbnQgPSB0aGlzLmNhdGVnb3J5UmVmcy5maW5kKG4gPT4gbi5pZCA9PT0gJGV2ZW50LmNhdGVnb3J5LmlkKTtcbiAgICBpZiAoY29tcG9uZW50KSB7XG4gICAgICBsZXQgeyB0b3AgfSA9IGNvbXBvbmVudDtcblxuICAgICAgaWYgKCRldmVudC5jYXRlZ29yeS5maXJzdCkge1xuICAgICAgICB0b3AgPSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG9wICs9IDE7XG4gICAgICB9XG4gICAgICB0aGlzLnNjcm9sbFJlZi5uYXRpdmVFbGVtZW50LnNjcm9sbFRvcCA9IHRvcDtcbiAgICB9XG4gICAgdGhpcy5zZWxlY3RlZCA9ICRldmVudC5jYXRlZ29yeS5uYW1lO1xuICAgIHRoaXMubmV4dFNjcm9sbCA9ICRldmVudC5jYXRlZ29yeS5uYW1lO1xuICB9XG4gIGNhdGVnb3J5VHJhY2soaW5kZXg6IG51bWJlciwgaXRlbTogYW55KSB7XG4gICAgcmV0dXJuIGl0ZW0uaWQ7XG4gIH1cbiAgaGFuZGxlU2Nyb2xsKCkge1xuICAgIGlmICh0aGlzLm5leHRTY3JvbGwpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWQgPSB0aGlzLm5leHRTY3JvbGw7XG4gICAgICB0aGlzLm5leHRTY3JvbGwgPSB1bmRlZmluZWQ7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghdGhpcy5zY3JvbGxSZWYpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2hvd1NpbmdsZUNhdGVnb3J5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGFjdGl2ZUNhdGVnb3J5ID0gbnVsbDtcbiAgICBpZiAodGhpcy5TRUFSQ0hfQ0FURUdPUlkuZW1vamlzKSB7XG4gICAgICBhY3RpdmVDYXRlZ29yeSA9IHRoaXMuU0VBUkNIX0NBVEVHT1JZO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB0YXJnZXQgPSB0aGlzLnNjcm9sbFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgLy8gY2hlY2sgc2Nyb2xsIGlzIG5vdCBhdCBib3R0b21cbiAgICAgIGlmICh0YXJnZXQuc2Nyb2xsVG9wID09PSAwKSB7XG4gICAgICAgIC8vIGhpdCB0aGUgVE9QXG4gICAgICAgIGFjdGl2ZUNhdGVnb3J5ID0gdGhpcy5jYXRlZ29yaWVzLmZpbmQobiA9PiBuLmZpcnN0ID09PSB0cnVlKTtcbiAgICAgIH0gZWxzZSBpZiAodGFyZ2V0LnNjcm9sbEhlaWdodCAtIHRhcmdldC5zY3JvbGxUb3AgPT09IHRoaXMuY2xpZW50SGVpZ2h0KSB7XG4gICAgICAgIC8vIHNjcm9sbGVkIHRvIGJvdHRvbSBhY3RpdmF0ZSBsYXN0IGNhdGVnb3J5XG4gICAgICAgIGFjdGl2ZUNhdGVnb3J5ID0gdGhpcy5jYXRlZ29yaWVzW3RoaXMuY2F0ZWdvcmllcy5sZW5ndGggLSAxXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHNjcm9sbGluZ1xuICAgICAgICBmb3IgKGNvbnN0IGNhdGVnb3J5IG9mIHRoaXMuY2F0ZWdvcmllcykge1xuICAgICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IHRoaXMuY2F0ZWdvcnlSZWZzLmZpbmQobiA9PiBuLmlkID09PSBjYXRlZ29yeS5pZCk7XG4gICAgICAgICAgY29uc3QgYWN0aXZlID0gY29tcG9uZW50IS5oYW5kbGVTY3JvbGwodGFyZ2V0LnNjcm9sbFRvcCk7XG4gICAgICAgICAgaWYgKGFjdGl2ZSkge1xuICAgICAgICAgICAgYWN0aXZlQ2F0ZWdvcnkgPSBjYXRlZ29yeTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5zY3JvbGxUb3AgPSB0YXJnZXQuc2Nyb2xsVG9wO1xuICAgIH1cbiAgICBpZiAoYWN0aXZlQ2F0ZWdvcnkpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWQgPSBhY3RpdmVDYXRlZ29yeS5uYW1lO1xuICAgIH1cbiAgfVxuICBoYW5kbGVTZWFyY2goJGVtb2ppczogYW55W10gfCBudWxsKSB7XG4gICAgdGhpcy5TRUFSQ0hfQ0FURUdPUlkuZW1vamlzID0gJGVtb2ppcztcbiAgICBmb3IgKGNvbnN0IGNvbXBvbmVudCBvZiB0aGlzLmNhdGVnb3J5UmVmcy50b0FycmF5KCkpIHtcbiAgICAgIGlmIChjb21wb25lbnQubmFtZSA9PT0gJ1NlYXJjaCcpIHtcbiAgICAgICAgY29tcG9uZW50LmVtb2ppcyA9ICRlbW9qaXM7XG4gICAgICAgIGNvbXBvbmVudC51cGRhdGVEaXNwbGF5KCRlbW9qaXMgPyAnYmxvY2snIDogJ25vbmUnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbXBvbmVudC51cGRhdGVEaXNwbGF5KCRlbW9qaXMgPyAnbm9uZScgOiAnYmxvY2snKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNjcm9sbFJlZi5uYXRpdmVFbGVtZW50LnNjcm9sbFRvcCA9IDA7XG4gICAgdGhpcy5oYW5kbGVTY3JvbGwoKTtcbiAgfVxuXG4gIGhhbmRsZUVudGVyS2V5KCRldmVudDogRXZlbnQsIGVtb2ppPzogRW1vamlEYXRhKSB7XG4gICAgaWYgKCFlbW9qaSkge1xuICAgICAgaWYgKHRoaXMuU0VBUkNIX0NBVEVHT1JZLmVtb2ppcyAhPT0gbnVsbCAmJiB0aGlzLlNFQVJDSF9DQVRFR09SWS5lbW9qaXMubGVuZ3RoKSB7XG4gICAgICAgIGVtb2ppID0gdGhpcy5TRUFSQ0hfQ0FURUdPUlkuZW1vamlzWzBdO1xuICAgICAgICBpZiAoZW1vamkpIHtcbiAgICAgICAgICB0aGlzLmVtb2ppU2VsZWN0LmVtaXQoeyAkZXZlbnQsIGVtb2ppIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghdGhpcy5oaWRlUmVjZW50ICYmICF0aGlzLnJlY2VudCAmJiBlbW9qaSkge1xuICAgICAgdGhpcy5mcmVxdWVudGx5LmFkZChlbW9qaSk7XG4gICAgfVxuXG4gICAgY29uc3QgY29tcG9uZW50ID0gdGhpcy5jYXRlZ29yeVJlZnMudG9BcnJheSgpWzFdO1xuICAgIGlmIChjb21wb25lbnQgJiYgdGhpcy5lbmFibGVGcmVxdWVudEVtb2ppU29ydCkge1xuICAgICAgY29tcG9uZW50LmdldEVtb2ppcygpO1xuICAgICAgY29tcG9uZW50LnJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cbiAgaGFuZGxlRW1vamlPdmVyKCRldmVudDogRW1vamlFdmVudCkge1xuICAgIGlmICghdGhpcy5zaG93UHJldmlldyB8fCAhdGhpcy5wcmV2aWV3UmVmKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZW1vamlEYXRhID0gdGhpcy5DVVNUT01fQ0FURUdPUlkuZW1vamlzIS5maW5kKFxuICAgICAgKGN1c3RvbUVtb2ppOiBhbnkpID0+IGN1c3RvbUVtb2ppLmlkID09PSAkZXZlbnQuZW1vamkuaWQsXG4gICAgKTtcbiAgICBpZiAoZW1vamlEYXRhKSB7XG4gICAgICAkZXZlbnQuZW1vamkgPSB7IC4uLmVtb2ppRGF0YSB9O1xuICAgIH1cblxuICAgIHRoaXMucHJldmlld0Vtb2ppID0gJGV2ZW50LmVtb2ppO1xuICAgIGNsZWFyVGltZW91dCh0aGlzLmxlYXZlVGltZW91dCk7XG4gIH1cbiAgaGFuZGxlRW1vamlMZWF2ZSgpIHtcbiAgICBpZiAoIXRoaXMuc2hvd1ByZXZpZXcgfHwgIXRoaXMucHJldmlld1JlZikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubGVhdmVUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnByZXZpZXdFbW9qaSA9IG51bGw7XG4gICAgICB0aGlzLnByZXZpZXdSZWYucmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH0sIDE2KTtcbiAgfVxuICBoYW5kbGVFbW9qaUNsaWNrKCRldmVudDogRW1vamlFdmVudCkge1xuICAgIHRoaXMuZW1vamlDbGljay5lbWl0KCRldmVudCk7XG4gICAgdGhpcy5lbW9qaVNlbGVjdC5lbWl0KCRldmVudCk7XG4gICAgdGhpcy5oYW5kbGVFbnRlcktleSgkZXZlbnQuJGV2ZW50LCAkZXZlbnQuZW1vamkpO1xuICB9XG4gIGhhbmRsZVNraW5DaGFuZ2Uoc2tpbjogRW1vamlbJ3NraW4nXSkge1xuICAgIHRoaXMuc2tpbiA9IHNraW47XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oYCR7dGhpcy5OQU1FU1BBQ0V9LnNraW5gLCBTdHJpbmcoc2tpbikpO1xuICAgIHRoaXMuc2tpbkNoYW5nZS5lbWl0KHNraW4pO1xuICB9XG4gIGdldFdpZHRoKCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuc3R5bGUgJiYgdGhpcy5zdHlsZS53aWR0aCkge1xuICAgICAgcmV0dXJuIHRoaXMuc3R5bGUud2lkdGg7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnBlckxpbmUgKiAodGhpcy5lbW9qaVNpemUgKyAxMikgKyAxMiArIDIgKyB0aGlzLm1lYXN1cmVTY3JvbGxiYXIgKyAncHgnO1xuICB9XG59XG4iXX0=
