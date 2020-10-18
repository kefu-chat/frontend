import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { EmojiService } from "@shared/lib/ngx-emoji-mart/ngx-emoji";
import { EmojiFrequentlyService } from "./emoji-frequently.service";
export class CategoryComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2F0ZWdvcnkuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9waWNrZXIvY2F0ZWdvcnkuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFFVCxZQUFZLEVBQ1osS0FBSyxFQUVMLE1BQU0sRUFDTixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFTLFlBQVksRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBK0RwRSxNQUFNLE9BQU8saUJBQWlCO0lBa0M1QixZQUNTLEdBQXNCLEVBQ3JCLFlBQTBCLEVBQzFCLFVBQWtDO1FBRm5DLFFBQUcsR0FBSCxHQUFHLENBQW1CO1FBQ3JCLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzFCLGVBQVUsR0FBVixVQUFVLENBQXdCO1FBbkNuQyxzQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFDekIsU0FBSSxHQUFHLEVBQUUsQ0FBQztRQUNWLFlBQU8sR0FBRyxDQUFDLENBQUM7UUFDWix1QkFBa0IsR0FBRyxDQUFDLENBQUM7UUFDdkIsV0FBTSxHQUFhLEVBQUUsQ0FBQztRQUN0QixXQUFNLEdBQVUsRUFBRSxDQUFDO1FBR25CLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBV25CLGNBQVMsR0FBdUIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNuRCxlQUFVLEdBQXdCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDckQsZUFBVSxHQUF3QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRy9ELG9CQUFlLEdBQVEsRUFBRSxDQUFDO1FBQzFCLGdCQUFXLEdBQVEsRUFBRSxDQUFDO1FBQ3RCLG9CQUFlLEdBQVEsRUFBRSxDQUFDO1FBQzFCLFdBQU0sR0FBRyxDQUFDLENBQUM7UUFDWCxjQUFTLEdBQUcs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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBdURUO2dCQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxtQkFBbUIsRUFBRSxLQUFLO2FBQzNCOzs7WUF6RUMsaUJBQWlCO1lBVUgsWUFBWTtZQUNuQixzQkFBc0I7OztxQkFnRTVCLEtBQUs7Z0NBQ0wsS0FBSzttQkFDTCxLQUFLO3NCQUNMLEtBQUs7aUNBQ0wsS0FBSztxQkFDTCxLQUFLO3FCQUNMLEtBQUs7bUJBQ0wsS0FBSztpQkFDTCxLQUFLOzJCQUNMLEtBQUs7NEJBQ0wsS0FBSzs0QkFDTCxLQUFLO3dCQUNMLEtBQUs7d0JBQ0wsS0FBSzt1QkFDTCxLQUFLOzZCQUNMLEtBQUs7NkJBQ0wsS0FBSzsyQkFDTCxLQUFLO3FDQUNMLEtBQUs7NkJBQ0wsS0FBSzt3QkFDTCxNQUFNO3lCQUNOLE1BQU07eUJBQ04sTUFBTTt3QkFDTixTQUFTLFNBQUMsV0FBVyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtvQkFDdkMsU0FBUyxTQUFDLE9BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFZpZXdDaGlsZCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEVtb2ppLCBFbW9qaVNlcnZpY2UgfSBmcm9tICdAY3RybC9uZ3gtZW1vamktbWFydC9uZ3gtZW1vamknO1xuaW1wb3J0IHsgRW1vamlGcmVxdWVudGx5U2VydmljZSB9IGZyb20gJy4vZW1vamktZnJlcXVlbnRseS5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZW1vamktY2F0ZWdvcnknLFxuICB0ZW1wbGF0ZTogYFxuICA8c2VjdGlvbiAjY29udGFpbmVyIGNsYXNzPVwiZW1vamktbWFydC1jYXRlZ29yeVwiXG4gICAgW2F0dHIuYXJpYS1sYWJlbF09XCJpMThuLmNhdGVnb3JpZXNbaWRdXCJcbiAgICBbY2xhc3MuZW1vamktbWFydC1uby1yZXN1bHRzXT1cImVtb2ppcyAmJiAhZW1vamlzLmxlbmd0aFwiXG4gICAgW25nU3R5bGVdPVwiY29udGFpbmVyU3R5bGVzXCI+XG4gICAgPGRpdiBjbGFzcz1cImVtb2ppLW1hcnQtY2F0ZWdvcnktbGFiZWxcIlxuICAgICAgW25nU3R5bGVdPVwibGFiZWxTdHlsZXNcIlxuICAgICAgW2F0dHIuZGF0YS1uYW1lXT1cIm5hbWVcIj5cbiAgICAgIDwhLS0gYWxyZWFkeSBsYWJlbGVkIGJ5IHRoZSBzZWN0aW9uIGFyaWEtbGFiZWwgLS0+XG4gICAgICA8c3BhbiAjbGFiZWwgW25nU3R5bGVdPVwibGFiZWxTcGFuU3R5bGVzXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgICAgIHt7IGkxOG4uY2F0ZWdvcmllc1tpZF0gfX1cbiAgICAgIDwvc3Bhbj5cbiAgICA8L2Rpdj5cblxuICAgIDxuZy10ZW1wbGF0ZSBbbmdJZl09XCJlbW9qaXNcIj5cbiAgICAgIDxuZ3gtZW1vamlcbiAgICAgICAgKm5nRm9yPVwibGV0IGVtb2ppIG9mIGVtb2ppczsgdHJhY2tCeTogdHJhY2tCeUlkXCJcbiAgICAgICAgW2Vtb2ppXT1cImVtb2ppXCJcbiAgICAgICAgW3NpemVdPVwiZW1vamlTaXplXCJcbiAgICAgICAgW3NraW5dPVwiZW1vamlTa2luXCJcbiAgICAgICAgW2lzTmF0aXZlXT1cImVtb2ppSXNOYXRpdmVcIlxuICAgICAgICBbc2V0XT1cImVtb2ppU2V0XCJcbiAgICAgICAgW3NoZWV0U2l6ZV09XCJlbW9qaVNoZWV0U2l6ZVwiXG4gICAgICAgIFtmb3JjZVNpemVdPVwiZW1vamlGb3JjZVNpemVcIlxuICAgICAgICBbdG9vbHRpcF09XCJlbW9qaVRvb2x0aXBcIlxuICAgICAgICBbYmFja2dyb3VuZEltYWdlRm5dPVwiZW1vamlCYWNrZ3JvdW5kSW1hZ2VGblwiXG4gICAgICAgIFtoaWRlT2Jzb2xldGVdPVwiaGlkZU9ic29sZXRlXCJcbiAgICAgICAgKGVtb2ppT3Zlcik9XCJlbW9qaU92ZXIuZW1pdCgkZXZlbnQpXCJcbiAgICAgICAgKGVtb2ppTGVhdmUpPVwiZW1vamlMZWF2ZS5lbWl0KCRldmVudClcIlxuICAgICAgICAoZW1vamlDbGljayk9XCJlbW9qaUNsaWNrLmVtaXQoJGV2ZW50KVwiXG4gICAgICA+PC9uZ3gtZW1vamk+XG4gICAgPC9uZy10ZW1wbGF0ZT5cblxuICAgIDxkaXYgKm5nSWY9XCJlbW9qaXMgJiYgIWVtb2ppcy5sZW5ndGhcIj5cbiAgICAgIDxkaXY+XG4gICAgICAgIDxuZ3gtZW1vamlcbiAgICAgICAgICBbZW1vamldPVwibm90Rm91bmRFbW9qaVwiXG4gICAgICAgICAgc2l6ZT1cIjM4XCJcbiAgICAgICAgICBbc2tpbl09XCJlbW9qaVNraW5cIlxuICAgICAgICAgIFtpc05hdGl2ZV09XCJlbW9qaUlzTmF0aXZlXCJcbiAgICAgICAgICBbc2V0XT1cImVtb2ppU2V0XCJcbiAgICAgICAgICBbc2hlZXRTaXplXT1cImVtb2ppU2hlZXRTaXplXCJcbiAgICAgICAgICBbZm9yY2VTaXplXT1cImVtb2ppRm9yY2VTaXplXCJcbiAgICAgICAgICBbdG9vbHRpcF09XCJlbW9qaVRvb2x0aXBcIlxuICAgICAgICAgIFtiYWNrZ3JvdW5kSW1hZ2VGbl09XCJlbW9qaUJhY2tncm91bmRJbWFnZUZuXCJcbiAgICAgICAgICBbdXNlQnV0dG9uXT1cImVtb2ppVXNlQnV0dG9uXCJcbiAgICAgICAgPjwvbmd4LWVtb2ppPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxkaXYgY2xhc3M9XCJlbW9qaS1tYXJ0LW5vLXJlc3VsdHMtbGFiZWxcIj5cbiAgICAgICAge3sgaTE4bi5ub3Rmb3VuZCB9fVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG5cbiAgPC9zZWN0aW9uPlxuICBgLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXG59KVxuZXhwb3J0IGNsYXNzIENhdGVnb3J5Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KCkgZW1vamlzPzogYW55W10gfCBudWxsO1xuICBASW5wdXQoKSBoYXNTdGlja3lQb3NpdGlvbiA9IHRydWU7XG4gIEBJbnB1dCgpIG5hbWUgPSAnJztcbiAgQElucHV0KCkgcGVyTGluZSA9IDk7XG4gIEBJbnB1dCgpIHRvdGFsRnJlcXVlbnRMaW5lcyA9IDQ7XG4gIEBJbnB1dCgpIHJlY2VudDogc3RyaW5nW10gPSBbXTtcbiAgQElucHV0KCkgY3VzdG9tOiBhbnlbXSA9IFtdO1xuICBASW5wdXQoKSBpMThuOiBhbnk7XG4gIEBJbnB1dCgpIGlkOiBhbnk7XG4gIEBJbnB1dCgpIGhpZGVPYnNvbGV0ZSA9IHRydWU7XG4gIEBJbnB1dCgpIG5vdEZvdW5kRW1vamk/OiBzdHJpbmc7XG4gIEBJbnB1dCgpIGVtb2ppSXNOYXRpdmU/OiBFbW9qaVsnaXNOYXRpdmUnXTtcbiAgQElucHV0KCkgZW1vamlTa2luITogRW1vamlbJ3NraW4nXTtcbiAgQElucHV0KCkgZW1vamlTaXplITogRW1vamlbJ3NpemUnXTtcbiAgQElucHV0KCkgZW1vamlTZXQhOiBFbW9qaVsnc2V0J107XG4gIEBJbnB1dCgpIGVtb2ppU2hlZXRTaXplITogRW1vamlbJ3NoZWV0U2l6ZSddO1xuICBASW5wdXQoKSBlbW9qaUZvcmNlU2l6ZSE6IEVtb2ppWydmb3JjZVNpemUnXTtcbiAgQElucHV0KCkgZW1vamlUb29sdGlwITogRW1vamlbJ3Rvb2x0aXAnXTtcbiAgQElucHV0KCkgZW1vamlCYWNrZ3JvdW5kSW1hZ2VGbj86IEVtb2ppWydiYWNrZ3JvdW5kSW1hZ2VGbiddO1xuICBASW5wdXQoKSBlbW9qaVVzZUJ1dHRvbj86IGJvb2xlYW47XG4gIEBPdXRwdXQoKSBlbW9qaU92ZXI6IEVtb2ppWydlbW9qaU92ZXInXSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGVtb2ppTGVhdmU6IEVtb2ppWydlbW9qaUxlYXZlJ10gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBlbW9qaUNsaWNrOiBFbW9qaVsnZW1vamlDbGljayddID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAVmlld0NoaWxkKCdjb250YWluZXInLCB7IHN0YXRpYzogdHJ1ZSB9KSBjb250YWluZXIhOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCdsYWJlbCcsIHsgc3RhdGljOiB0cnVlIH0pIGxhYmVsITogRWxlbWVudFJlZjtcbiAgY29udGFpbmVyU3R5bGVzOiBhbnkgPSB7fTtcbiAgbGFiZWxTdHlsZXM6IGFueSA9IHt9O1xuICBsYWJlbFNwYW5TdHlsZXM6IGFueSA9IHt9O1xuICBtYXJnaW4gPSAwO1xuICBtaW5NYXJnaW4gPSAwO1xuICBtYXhNYXJnaW4gPSAwO1xuICB0b3AgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyByZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgZW1vamlTZXJ2aWNlOiBFbW9qaVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBmcmVxdWVudGx5OiBFbW9qaUZyZXF1ZW50bHlTZXJ2aWNlLFxuICApIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5lbW9qaXMgPSB0aGlzLmdldEVtb2ppcygpO1xuXG4gICAgaWYgKCF0aGlzLmVtb2ppcykge1xuICAgICAgdGhpcy5jb250YWluZXJTdHlsZXMgPSB7IGRpc3BsYXk6ICdub25lJyB9O1xuICAgIH1cblxuICAgIGlmICghdGhpcy5oYXNTdGlja3lQb3NpdGlvbikge1xuICAgICAgdGhpcy5sYWJlbFN0eWxlcyA9IHsgaGVpZ2h0OiAyOCB9O1xuICAgICAgLy8gdGhpcy5sYWJlbFNwYW5TdHlsZXMgPSB7IHBvc2l0aW9uOiAnYWJzb2x1dGUnIH07XG4gICAgfVxuICB9XG4gIG1lbW9pemVTaXplKCkge1xuICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuY29udGFpbmVyLm5hdGl2ZUVsZW1lbnQucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xuICAgIGNvbnN0IHtcbiAgICAgIHRvcCxcbiAgICAgIGhlaWdodCxcbiAgICB9ID0gdGhpcy5jb250YWluZXIubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBwYXJlbnRUb3AgPSBwYXJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xuICAgIGNvbnN0IGxhYmVsSGVpZ2h0ID0gdGhpcy5sYWJlbC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcblxuICAgIHRoaXMudG9wID0gdG9wIC0gcGFyZW50VG9wICsgcGFyZW50LnNjcm9sbFRvcDtcblxuICAgIGlmIChoZWlnaHQgPT09IDApIHtcbiAgICAgIHRoaXMubWF4TWFyZ2luID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tYXhNYXJnaW4gPSBoZWlnaHQgLSBsYWJlbEhlaWdodDtcbiAgICB9XG4gIH1cbiAgaGFuZGxlU2Nyb2xsKHNjcm9sbFRvcDogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgbGV0IG1hcmdpbiA9IHNjcm9sbFRvcCAtIHRoaXMudG9wO1xuICAgIG1hcmdpbiA9IG1hcmdpbiA8IHRoaXMubWluTWFyZ2luID8gdGhpcy5taW5NYXJnaW4gOiBtYXJnaW47XG4gICAgbWFyZ2luID0gbWFyZ2luID4gdGhpcy5tYXhNYXJnaW4gPyB0aGlzLm1heE1hcmdpbiA6IG1hcmdpbjtcblxuICAgIGlmIChtYXJnaW4gPT09IHRoaXMubWFyZ2luKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmhhc1N0aWNreVBvc2l0aW9uKSB7XG4gICAgICB0aGlzLmxhYmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUudG9wID0gYCR7bWFyZ2lufXB4YDtcbiAgICB9XG5cbiAgICB0aGlzLm1hcmdpbiA9IG1hcmdpbjtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGdldEVtb2ppcygpIHtcbiAgICBpZiAodGhpcy5uYW1lID09PSAnUmVjZW50Jykge1xuICAgICAgbGV0IGZyZXF1ZW50bHlVc2VkID0gdGhpcy5yZWNlbnQgfHwgdGhpcy5mcmVxdWVudGx5LmdldCh0aGlzLnBlckxpbmUsIHRoaXMudG90YWxGcmVxdWVudExpbmVzKTtcbiAgICAgIGlmICghZnJlcXVlbnRseVVzZWQgfHwgIWZyZXF1ZW50bHlVc2VkLmxlbmd0aCkge1xuICAgICAgICBmcmVxdWVudGx5VXNlZCA9IHRoaXMuZnJlcXVlbnRseS5nZXQodGhpcy5wZXJMaW5lLCB0aGlzLnRvdGFsRnJlcXVlbnRMaW5lcyk7XG4gICAgICB9XG4gICAgICBpZiAoZnJlcXVlbnRseVVzZWQubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuZW1vamlzID0gZnJlcXVlbnRseVVzZWRcbiAgICAgICAgICAubWFwKGlkID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVtb2ppID0gdGhpcy5jdXN0b20uZmlsdGVyKChlOiBhbnkpID0+IGUuaWQgPT09IGlkKVswXTtcbiAgICAgICAgICAgIGlmIChlbW9qaSkge1xuICAgICAgICAgICAgICByZXR1cm4gZW1vamk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBpZDtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5maWx0ZXIoaWQgPT4gISF0aGlzLmVtb2ppU2VydmljZS5nZXREYXRhKGlkKSk7XG4gICAgICB9XG5cbiAgICAgIGlmICgoIXRoaXMuZW1vamlzIHx8IHRoaXMuZW1vamlzLmxlbmd0aCA9PT0gMCkgJiYgZnJlcXVlbnRseVVzZWQubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5lbW9qaXMpIHtcbiAgICAgIHRoaXMuZW1vamlzID0gdGhpcy5lbW9qaXMuc2xpY2UoMCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZW1vamlzO1xuICB9XG4gIHVwZGF0ZURpc3BsYXkoZGlzcGxheTogJ25vbmUnIHwgJ2Jsb2NrJykge1xuICAgIHRoaXMuY29udGFpbmVyU3R5bGVzLmRpc3BsYXkgPSBkaXNwbGF5O1xuICAgIHRoaXMuZ2V0RW1vamlzKCk7XG4gICAgdGhpcy5yZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG4gIHRyYWNrQnlJZChpbmRleDogbnVtYmVyLCBpdGVtOiBhbnkpIHtcbiAgICByZXR1cm4gaXRlbTtcbiAgfVxufVxuIl19
