import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { DEFAULT_BACKGROUNDFN, EmojiService } from "./emoji.service";
export class EmojiComponent {
  constructor(emojiService) {
    this.emojiService = emojiService;
    this.skin = 1;
    this.set = "apple";
    this.sheetSize = 64;
    /** Renders the native unicode emoji */
    this.isNative = false;
    this.forceSize = false;
    this.tooltip = false;
    this.size = 24;
    this.emoji = "";
    this.hideObsolete = false;
    this.SHEET_COLUMNS = 57;
    this.emojiOver = new EventEmitter();
    this.emojiLeave = new EventEmitter();
    this.emojiClick = new EventEmitter();
    this.title = "";
    this.label = "";
    this.custom = false;
    this.isVisible = true;
    // TODO: replace 4.0.3 w/ dynamic get verison from emoji-datasource in package.json
    this.backgroundImageFn = DEFAULT_BACKGROUNDFN;
  }
  ngOnChanges() {
    if (!this.emoji) {
      return (this.isVisible = false);
    }
    const data = this.getData();
    if (!data) {
      return (this.isVisible = false);
    }
    // const children = this.children;
    this.unified = data.native || null;
    if (data.custom) {
      this.custom = data.custom;
    }
    if (!data.unified && !data.custom) {
      return (this.isVisible = false);
    }
    if (this.tooltip) {
      this.title = data.shortNames[0];
    }
    if (data.obsoletedBy && this.hideObsolete) {
      return (this.isVisible = false);
    }
    this.label = [data.native]
      .concat(data.shortNames)
      .filter(Boolean)
      .join(", ");
    if (this.isNative && data.unified && data.native) {
      // hide older emoji before the split into gendered emoji
      this.style = { fontSize: `${this.size}px` };
      if (this.forceSize) {
        this.style.display = "inline-block";
        this.style.width = `${this.size}px`;
        this.style.height = `${this.size}px`;
        this.style["word-break"] = "keep-all";
      }
    } else if (data.custom) {
      this.style = {
        width: `${this.size}px`,
        height: `${this.size}px`,
        display: "inline-block",
      };
      if (data.spriteUrl && this.sheetRows && this.sheetColumns) {
        this.style = Object.assign(Object.assign({}, this.style), {
          backgroundImage: `url(${data.spriteUrl})`,
          backgroundSize: `${100 * this.sheetColumns}% ${
            100 * this.sheetRows
          }%`,
          backgroundPosition: this.emojiService.getSpritePosition(
            data.sheet,
            this.sheetColumns
          ),
        });
      } else {
        this.style = Object.assign(Object.assign({}, this.style), {
          backgroundImage: `url(${data.imageUrl})`,
          backgroundSize: "contain",
        });
      }
    } else {
      if (data.hidden.length && data.hidden.includes(this.set)) {
        if (this.fallback) {
          this.style = { fontSize: `${this.size}px` };
          this.unified = this.fallback(data, this);
        } else {
          return (this.isVisible = false);
        }
      } else {
        this.style = this.emojiService.emojiSpriteStyles(
          data.sheet,
          this.set,
          this.size,
          this.sheetSize,
          this.sheetRows,
          this.backgroundImageFn,
          this.SHEET_COLUMNS
        );
      }
    }
    return (this.isVisible = true);
  }
  getData() {
    return this.emojiService.getData(this.emoji, this.skin, this.set);
  }
  getSanitizedData() {
    return this.emojiService.getSanitizedData(this.emoji, this.skin, this.set);
  }
  handleClick($event) {
    const emoji = this.getSanitizedData();
    this.emojiClick.emit({ emoji, $event });
  }
  handleOver($event) {
    const emoji = this.getSanitizedData();
    this.emojiOver.emit({ emoji, $event });
  }
  handleLeave($event) {
    const emoji = this.getSanitizedData();
    this.emojiLeave.emit({ emoji, $event });
  }
}
EmojiComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: "ngx-emoji",
        template: `
    <button
      *ngIf="useButton && isVisible"
      type="button"
      (click)="handleClick($event)"
      (mouseenter)="handleOver($event)"
      (mouseleave)="handleLeave($event)"
      [title]="title"
      [attr.aria-label]="label"
      class="emoji-mart-emoji"
      [class.emoji-mart-emoji-native]="isNative"
      [class.emoji-mart-emoji-custom]="custom"
    >
      <span [ngStyle]="style">
        <ng-template [ngIf]="isNative">{{ unified }}</ng-template>
        <ng-content></ng-content>
      </span>
    </button>

    <span
      *ngIf="!useButton && isVisible"
      (click)="handleClick($event)"
      (mouseenter)="handleOver($event)"
      (mouseleave)="handleLeave($event)"
      [title]="title"
      [attr.aria-label]="label"
      class="emoji-mart-emoji"
      [class.emoji-mart-emoji-native]="isNative"
      [class.emoji-mart-emoji-custom]="custom"
    >
      <span [ngStyle]="style">
        <ng-template [ngIf]="isNative">{{ unified }}</ng-template>
        <ng-content></ng-content>
      </span>
    </span>
  `,
        changeDetection: ChangeDetectionStrategy.OnPush,
        preserveWhitespaces: false,
      },
    ],
  },
];
EmojiComponent.ctorParameters = () => [{ type: EmojiService }];
EmojiComponent.propDecorators = {
  skin: [{ type: Input }],
  set: [{ type: Input }],
  sheetSize: [{ type: Input }],
  isNative: [{ type: Input }],
  forceSize: [{ type: Input }],
  tooltip: [{ type: Input }],
  size: [{ type: Input }],
  emoji: [{ type: Input }],
  fallback: [{ type: Input }],
  hideObsolete: [{ type: Input }],
  SHEET_COLUMNS: [{ type: Input }],
  sheetRows: [{ type: Input }],
  sheetColumns: [{ type: Input }],
  useButton: [{ type: Input }],
  emojiOver: [{ type: Output }],
  emojiLeave: [{ type: Output }],
  emojiClick: [{ type: Output }],
  backgroundImageFn: [{ type: Input }],
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1vamkuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9waWNrZXIvbmd4LWVtb2ppL2Vtb2ppLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUVMLE1BQU0sRUFDUCxNQUFNLGVBQWUsQ0FBQztBQUd2QixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFrRXJFLE1BQU0sT0FBTyxjQUFjO0lBNEJ6QixZQUFvQixZQUEwQjtRQUExQixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQTNCckMsU0FBSSxHQUFrQixDQUFDLENBQUM7UUFDeEIsUUFBRyxHQUFpQixPQUFPLENBQUM7UUFDNUIsY0FBUyxHQUF1QixFQUFFLENBQUM7UUFDNUMsdUNBQXVDO1FBQzlCLGFBQVEsR0FBc0IsS0FBSyxDQUFDO1FBQ3BDLGNBQVMsR0FBdUIsS0FBSyxDQUFDO1FBQ3RDLFlBQU8sR0FBcUIsS0FBSyxDQUFDO1FBQ2xDLFNBQUksR0FBa0IsRUFBRSxDQUFDO1FBQ3pCLFVBQUssR0FBbUIsRUFBRSxDQUFDO1FBRTNCLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLGtCQUFhLEdBQUcsRUFBRSxDQUFDO1FBSWxCLGNBQVMsR0FBdUIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNuRCxlQUFVLEdBQXdCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDckQsZUFBVSxHQUF3QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRS9ELFVBQUssR0FBRyxFQUFFLENBQUM7UUFDWCxVQUFLLEdBQUcsRUFBRSxDQUFDO1FBRVgsV0FBTSxHQUFHLEtBQUssQ0FBQztRQUNmLGNBQVMsR0FBRyxJQUFJLENBQUM7UUFDakIsbUZBQW1GO1FBQzFFLHNCQUFpQixHQUErQixvQkFBb0IsQ0FBQztJQUU3QixD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QUs7d0JBQ0wsTUFBTTt5QkFDTixNQUFNO3lCQUNOLE1BQU07Z0NBUU4sS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT3V0cHV0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBFbW9qaURhdGEgfSBmcm9tICcuL2RhdGEvZGF0YS5pbnRlcmZhY2VzJztcbmltcG9ydCB7IERFRkFVTFRfQkFDS0dST1VOREZOLCBFbW9qaVNlcnZpY2UgfSBmcm9tICcuL2Vtb2ppLnNlcnZpY2UnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVtb2ppIHtcbiAgLyoqIFJlbmRlcnMgdGhlIG5hdGl2ZSB1bmljb2RlIGVtb2ppICovXG4gIGlzTmF0aXZlOiBib29sZWFuO1xuICBmb3JjZVNpemU6IGJvb2xlYW47XG4gIHRvb2x0aXA6IGJvb2xlYW47XG4gIHNraW46IDEgfCAyIHwgMyB8IDQgfCA1IHwgNjtcbiAgc2hlZXRTaXplOiAxNiB8IDIwIHwgMzIgfCA2NDtcbiAgc2hlZXRSb3dzPzogbnVtYmVyO1xuICBzZXQ6ICdhcHBsZScgfCAnZ29vZ2xlJyB8ICd0d2l0dGVyJyB8ICdmYWNlYm9vaycgfCAnJztcbiAgc2l6ZTogbnVtYmVyO1xuICBlbW9qaTogc3RyaW5nIHwgRW1vamlEYXRhO1xuICBiYWNrZ3JvdW5kSW1hZ2VGbjogKHNldDogc3RyaW5nLCBzaGVldFNpemU6IG51bWJlcikgPT4gc3RyaW5nO1xuICBmYWxsYmFjaz86IChkYXRhOiBhbnksIHByb3BzOiBhbnkpID0+IHN0cmluZztcbiAgZW1vamlPdmVyOiBFdmVudEVtaXR0ZXI8RW1vamlFdmVudD47XG4gIGVtb2ppTGVhdmU6IEV2ZW50RW1pdHRlcjxFbW9qaUV2ZW50PjtcbiAgZW1vamlDbGljazogRXZlbnRFbWl0dGVyPEVtb2ppRXZlbnQ+O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEVtb2ppRXZlbnQge1xuICBlbW9qaTogRW1vamlEYXRhO1xuICAkZXZlbnQ6IEV2ZW50O1xufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtZW1vamknLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxidXR0b25cbiAgICAgICpuZ0lmPVwidXNlQnV0dG9uICYmIGlzVmlzaWJsZVwiXG4gICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgIChjbGljayk9XCJoYW5kbGVDbGljaygkZXZlbnQpXCJcbiAgICAgIChtb3VzZWVudGVyKT1cImhhbmRsZU92ZXIoJGV2ZW50KVwiXG4gICAgICAobW91c2VsZWF2ZSk9XCJoYW5kbGVMZWF2ZSgkZXZlbnQpXCJcbiAgICAgIFt0aXRsZV09XCJ0aXRsZVwiXG4gICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImxhYmVsXCJcbiAgICAgIGNsYXNzPVwiZW1vamktbWFydC1lbW9qaVwiXG4gICAgICBbY2xhc3MuZW1vamktbWFydC1lbW9qaS1uYXRpdmVdPVwiaXNOYXRpdmVcIlxuICAgICAgW2NsYXNzLmVtb2ppLW1hcnQtZW1vamktY3VzdG9tXT1cImN1c3RvbVwiXG4gICAgPlxuICAgICAgPHNwYW4gW25nU3R5bGVdPVwic3R5bGVcIj5cbiAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ0lmXT1cImlzTmF0aXZlXCI+e3sgdW5pZmllZCB9fTwvbmctdGVtcGxhdGU+XG4gICAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICAgIDwvc3Bhbj5cbiAgICA8L2J1dHRvbj5cblxuICAgIDxzcGFuXG4gICAgICAqbmdJZj1cIiF1c2VCdXR0b24gJiYgaXNWaXNpYmxlXCJcbiAgICAgIChjbGljayk9XCJoYW5kbGVDbGljaygkZXZlbnQpXCJcbiAgICAgIChtb3VzZWVudGVyKT1cImhhbmRsZU92ZXIoJGV2ZW50KVwiXG4gICAgICAobW91c2VsZWF2ZSk9XCJoYW5kbGVMZWF2ZSgkZXZlbnQpXCJcbiAgICAgIFt0aXRsZV09XCJ0aXRsZVwiXG4gICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImxhYmVsXCJcbiAgICAgIGNsYXNzPVwiZW1vamktbWFydC1lbW9qaVwiXG4gICAgICBbY2xhc3MuZW1vamktbWFydC1lbW9qaS1uYXRpdmVdPVwiaXNOYXRpdmVcIlxuICAgICAgW2NsYXNzLmVtb2ppLW1hcnQtZW1vamktY3VzdG9tXT1cImN1c3RvbVwiXG4gICAgPlxuICAgICAgPHNwYW4gW25nU3R5bGVdPVwic3R5bGVcIj5cbiAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ0lmXT1cImlzTmF0aXZlXCI+e3sgdW5pZmllZCB9fTwvbmctdGVtcGxhdGU+XG4gICAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICAgIDwvc3Bhbj5cbiAgICA8L3NwYW4+XG4gIGAsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBmYWxzZVxufSlcbmV4cG9ydCBjbGFzcyBFbW9qaUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgRW1vamkge1xuICBASW5wdXQoKSBza2luOiBFbW9qaVsnc2tpbiddID0gMTtcbiAgQElucHV0KCkgc2V0OiBFbW9qaVsnc2V0J10gPSAnYXBwbGUnO1xuICBASW5wdXQoKSBzaGVldFNpemU6IEVtb2ppWydzaGVldFNpemUnXSA9IDY0O1xuICAvKiogUmVuZGVycyB0aGUgbmF0aXZlIHVuaWNvZGUgZW1vamkgKi9cbiAgQElucHV0KCkgaXNOYXRpdmU6IEVtb2ppWydpc05hdGl2ZSddID0gZmFsc2U7XG4gIEBJbnB1dCgpIGZvcmNlU2l6ZTogRW1vamlbJ2ZvcmNlU2l6ZSddID0gZmFsc2U7XG4gIEBJbnB1dCgpIHRvb2x0aXA6IEVtb2ppWyd0b29sdGlwJ10gPSBmYWxzZTtcbiAgQElucHV0KCkgc2l6ZTogRW1vamlbJ3NpemUnXSA9IDI0O1xuICBASW5wdXQoKSBlbW9qaTogRW1vamlbJ2Vtb2ppJ10gPSAnJztcbiAgQElucHV0KCkgZmFsbGJhY2s/OiBFbW9qaVsnZmFsbGJhY2snXTtcbiAgQElucHV0KCkgaGlkZU9ic29sZXRlID0gZmFsc2U7XG4gIEBJbnB1dCgpIFNIRUVUX0NPTFVNTlMgPSA1NztcbiAgQElucHV0KCkgc2hlZXRSb3dzPzogbnVtYmVyO1xuICBASW5wdXQoKSBzaGVldENvbHVtbnM/OiBudW1iZXI7XG4gIEBJbnB1dCgpIHVzZUJ1dHRvbj86IGJvb2xlYW47XG4gIEBPdXRwdXQoKSBlbW9qaU92ZXI6IEVtb2ppWydlbW9qaU92ZXInXSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGVtb2ppTGVhdmU6IEVtb2ppWydlbW9qaUxlYXZlJ10gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBlbW9qaUNsaWNrOiBFbW9qaVsnZW1vamlDbGljayddID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBzdHlsZTogYW55O1xuICB0aXRsZSA9ICcnO1xuICBsYWJlbCA9ICcnO1xuICB1bmlmaWVkPzogc3RyaW5nIHwgbnVsbDtcbiAgY3VzdG9tID0gZmFsc2U7XG4gIGlzVmlzaWJsZSA9IHRydWU7XG4gIC8vIFRPRE86IHJlcGxhY2UgNC4wLjMgdy8gZHluYW1pYyBnZXQgdmVyaXNvbiBmcm9tIGVtb2ppLWRhdGFzb3VyY2UgaW4gcGFja2FnZS5qc29uXG4gIEBJbnB1dCgpIGJhY2tncm91bmRJbWFnZUZuOiBFbW9qaVsnYmFja2dyb3VuZEltYWdlRm4nXSA9IERFRkFVTFRfQkFDS0dST1VOREZOO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZW1vamlTZXJ2aWNlOiBFbW9qaVNlcnZpY2UpIHt9XG5cbiAgbmdPbkNoYW5nZXMoKSB7XG4gICAgaWYgKCF0aGlzLmVtb2ppKSB7XG4gICAgICByZXR1cm4gKHRoaXMuaXNWaXNpYmxlID0gZmFsc2UpO1xuICAgIH1cbiAgICBjb25zdCBkYXRhID0gdGhpcy5nZXREYXRhKCk7XG4gICAgaWYgKCFkYXRhKSB7XG4gICAgICByZXR1cm4gKHRoaXMuaXNWaXNpYmxlID0gZmFsc2UpO1xuICAgIH1cbiAgICAvLyBjb25zdCBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW47XG4gICAgdGhpcy51bmlmaWVkID0gZGF0YS5uYXRpdmUgfHwgbnVsbDtcbiAgICBpZiAoZGF0YS5jdXN0b20pIHtcbiAgICAgIHRoaXMuY3VzdG9tID0gZGF0YS5jdXN0b207XG4gICAgfVxuICAgIGlmICghZGF0YS51bmlmaWVkICYmICFkYXRhLmN1c3RvbSkge1xuICAgICAgcmV0dXJuICh0aGlzLmlzVmlzaWJsZSA9IGZhbHNlKTtcbiAgICB9XG4gICAgaWYgKHRoaXMudG9vbHRpcCkge1xuICAgICAgdGhpcy50aXRsZSA9IGRhdGEuc2hvcnROYW1lc1swXTtcbiAgICB9XG4gICAgaWYgKGRhdGEub2Jzb2xldGVkQnkgJiYgdGhpcy5oaWRlT2Jzb2xldGUpIHtcbiAgICAgIHJldHVybiAodGhpcy5pc1Zpc2libGUgPSBmYWxzZSk7XG4gICAgfVxuXG4gICAgdGhpcy5sYWJlbCA9IFtkYXRhLm5hdGl2ZV1cbiAgICAgIC5jb25jYXQoZGF0YS5zaG9ydE5hbWVzKVxuICAgICAgLmZpbHRlcihCb29sZWFuKVxuICAgICAgLmpvaW4oJywgJyk7XG5cbiAgICBpZiAodGhpcy5pc05hdGl2ZSAmJiBkYXRhLnVuaWZpZWQgJiYgZGF0YS5uYXRpdmUpIHtcbiAgICAgIC8vIGhpZGUgb2xkZXIgZW1vamkgYmVmb3JlIHRoZSBzcGxpdCBpbnRvIGdlbmRlcmVkIGVtb2ppXG4gICAgICB0aGlzLnN0eWxlID0geyBmb250U2l6ZTogYCR7dGhpcy5zaXplfXB4YCB9O1xuXG4gICAgICBpZiAodGhpcy5mb3JjZVNpemUpIHtcbiAgICAgICAgdGhpcy5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jayc7XG4gICAgICAgIHRoaXMuc3R5bGUud2lkdGggPSBgJHt0aGlzLnNpemV9cHhgO1xuICAgICAgICB0aGlzLnN0eWxlLmhlaWdodCA9IGAke3RoaXMuc2l6ZX1weGA7XG4gICAgICAgIHRoaXMuc3R5bGVbJ3dvcmQtYnJlYWsnXSA9ICdrZWVwLWFsbCc7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChkYXRhLmN1c3RvbSkge1xuICAgICAgdGhpcy5zdHlsZSA9IHtcbiAgICAgICAgd2lkdGg6IGAke3RoaXMuc2l6ZX1weGAsXG4gICAgICAgIGhlaWdodDogYCR7dGhpcy5zaXplfXB4YCxcbiAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaydcbiAgICAgIH07XG4gICAgICBpZiAoZGF0YS5zcHJpdGVVcmwgJiYgdGhpcy5zaGVldFJvd3MgJiYgdGhpcy5zaGVldENvbHVtbnMpIHtcbiAgICAgICAgdGhpcy5zdHlsZSA9IHtcbiAgICAgICAgICAuLi50aGlzLnN0eWxlLFxuICAgICAgICAgIGJhY2tncm91bmRJbWFnZTogYHVybCgke2RhdGEuc3ByaXRlVXJsfSlgLFxuICAgICAgICAgIGJhY2tncm91bmRTaXplOiBgJHsxMDAgKiB0aGlzLnNoZWV0Q29sdW1uc30lICR7MTAwICogdGhpcy5zaGVldFJvd3N9JWAsXG4gICAgICAgICAgYmFja2dyb3VuZFBvc2l0aW9uOiB0aGlzLmVtb2ppU2VydmljZS5nZXRTcHJpdGVQb3NpdGlvbihcbiAgICAgICAgICAgIGRhdGEuc2hlZXQsXG4gICAgICAgICAgICB0aGlzLnNoZWV0Q29sdW1uc1xuICAgICAgICAgIClcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3R5bGUgPSB7XG4gICAgICAgICAgLi4udGhpcy5zdHlsZSxcbiAgICAgICAgICBiYWNrZ3JvdW5kSW1hZ2U6IGB1cmwoJHtkYXRhLmltYWdlVXJsfSlgLFxuICAgICAgICAgIGJhY2tncm91bmRTaXplOiAnY29udGFpbidcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGRhdGEuaGlkZGVuLmxlbmd0aCAmJiBkYXRhLmhpZGRlbi5pbmNsdWRlcyh0aGlzLnNldCkpIHtcbiAgICAgICAgaWYgKHRoaXMuZmFsbGJhY2spIHtcbiAgICAgICAgICB0aGlzLnN0eWxlID0geyBmb250U2l6ZTogYCR7dGhpcy5zaXplfXB4YCB9O1xuICAgICAgICAgIHRoaXMudW5pZmllZCA9IHRoaXMuZmFsbGJhY2soZGF0YSwgdGhpcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuICh0aGlzLmlzVmlzaWJsZSA9IGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdHlsZSA9IHRoaXMuZW1vamlTZXJ2aWNlLmVtb2ppU3ByaXRlU3R5bGVzKFxuICAgICAgICAgIGRhdGEuc2hlZXQsXG4gICAgICAgICAgdGhpcy5zZXQsXG4gICAgICAgICAgdGhpcy5zaXplLFxuICAgICAgICAgIHRoaXMuc2hlZXRTaXplLFxuICAgICAgICAgIHRoaXMuc2hlZXRSb3dzLFxuICAgICAgICAgIHRoaXMuYmFja2dyb3VuZEltYWdlRm4sXG4gICAgICAgICAgdGhpcy5TSEVFVF9DT0xVTU5TXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiAodGhpcy5pc1Zpc2libGUgPSB0cnVlKTtcbiAgfVxuXG4gIGdldERhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1vamlTZXJ2aWNlLmdldERhdGEodGhpcy5lbW9qaSwgdGhpcy5za2luLCB0aGlzLnNldCk7XG4gIH1cblxuICBnZXRTYW5pdGl6ZWREYXRhKCk6IEVtb2ppRGF0YSB7XG4gICAgcmV0dXJuIHRoaXMuZW1vamlTZXJ2aWNlLmdldFNhbml0aXplZERhdGEoXG4gICAgICB0aGlzLmVtb2ppLFxuICAgICAgdGhpcy5za2luLFxuICAgICAgdGhpcy5zZXRcbiAgICApIGFzIEVtb2ppRGF0YTtcbiAgfVxuXG4gIGhhbmRsZUNsaWNrKCRldmVudDogRXZlbnQpIHtcbiAgICBjb25zdCBlbW9qaSA9IHRoaXMuZ2V0U2FuaXRpemVkRGF0YSgpO1xuICAgIHRoaXMuZW1vamlDbGljay5lbWl0KHsgZW1vamksICRldmVudCB9KTtcbiAgfVxuXG4gIGhhbmRsZU92ZXIoJGV2ZW50OiBFdmVudCkge1xuICAgIGNvbnN0IGVtb2ppID0gdGhpcy5nZXRTYW5pdGl6ZWREYXRhKCk7XG4gICAgdGhpcy5lbW9qaU92ZXIuZW1pdCh7IGVtb2ppLCAkZXZlbnQgfSk7XG4gIH1cblxuICBoYW5kbGVMZWF2ZSgkZXZlbnQ6IEV2ZW50KSB7XG4gICAgY29uc3QgZW1vamkgPSB0aGlzLmdldFNhbml0aXplZERhdGEoKTtcbiAgICB0aGlzLmVtb2ppTGVhdmUuZW1pdCh7IGVtb2ppLCAkZXZlbnQgfSk7XG4gIH1cbn1cbiJdfQ==
