import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { EmojiService } from "@shared/lib/ngx-emoji-mart/ngx-emoji";
export class PreviewComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJldmlldy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbGliL3BpY2tlci9wcmV2aWV3LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsWUFBWSxFQUNaLEtBQUssRUFFTCxNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFvQixZQUFZLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQTJEaEYsTUFBTSxPQUFPLGdCQUFnQjtJQWUzQixZQUNTLEdBQXNCLEVBQ3JCLFlBQTBCO1FBRDNCLFFBQUcsR0FBSCxHQUFHLENBQW1CO1FBQ3JCLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBTjFCLGVBQVUsR0FBRyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQ2xELGNBQVMsR0FBdUIsRUFBRSxDQUFDO0lBTWhDLENBQUM7SUFFSixXQUFXO1FBQ1QsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZixPQUFPO1NBQ1I7UUFDRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFjLENBQUM7UUFDbkcsTUFBTSxjQUFjLEdBQWEsRUFBRSxDQUFDO1FBQ3BDLE1BQU0sZUFBZSxHQUFhLEVBQUUsQ0FBQztRQUNyQyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUM7UUFDakQsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQWdCLEVBQUUsRUFBRTtZQUNyQyxJQUFJLGNBQWMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN2RCxPQUFPO2FBQ1I7WUFDRCxjQUFjLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1lBQzVDLGVBQWUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakMsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQztJQUN6QyxDQUFDOzs7WUE3RkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxlQUFlO2dCQUN6QixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW1EVDtnQkFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsbUJBQW1CLEVBQUUsS0FBSzthQUMzQjs7O1lBbEVDLGlCQUFpQjtZQVFRLFlBQVk7OztvQkE0RHBDLEtBQUs7b0JBQ0wsS0FBSzt3QkFDTCxLQUFLO21CQUNMLEtBQUs7NEJBQ0wsS0FBSzt3QkFDTCxLQUFLO3dCQUNMLEtBQUs7dUJBQ0wsS0FBSzs2QkFDTCxLQUFLO3FDQUNMLEtBQUs7eUJBQ0wsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE91dHB1dCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEVtb2ppLCBFbW9qaURhdGEsIEVtb2ppU2VydmljZSB9IGZyb20gJ0BjdHJsL25neC1lbW9qaS1tYXJ0L25neC1lbW9qaSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Vtb2ppLXByZXZpZXcnLFxuICB0ZW1wbGF0ZTogYFxuICA8ZGl2IGNsYXNzPVwiZW1vamktbWFydC1wcmV2aWV3XCIgKm5nSWY9XCJlbW9qaSAmJiBlbW9qaURhdGFcIj5cbiAgICA8ZGl2IGNsYXNzPVwiZW1vamktbWFydC1wcmV2aWV3LWVtb2ppXCI+XG4gICAgICA8bmd4LWVtb2ppXG4gICAgICAgIFtlbW9qaV09XCJlbW9qaVwiXG4gICAgICAgIFtzaXplXT1cIjM4XCJcbiAgICAgICAgW2lzTmF0aXZlXT1cImVtb2ppSXNOYXRpdmVcIlxuICAgICAgICBbc2tpbl09XCJlbW9qaVNraW5cIlxuICAgICAgICBbc2l6ZV09XCJlbW9qaVNpemVcIlxuICAgICAgICBbc2V0XT1cImVtb2ppU2V0XCJcbiAgICAgICAgW3NoZWV0U2l6ZV09XCJlbW9qaVNoZWV0U2l6ZVwiXG4gICAgICAgIFtiYWNrZ3JvdW5kSW1hZ2VGbl09XCJlbW9qaUJhY2tncm91bmRJbWFnZUZuXCJcbiAgICAgID48L25neC1lbW9qaT5cbiAgICA8L2Rpdj5cblxuICAgIDxkaXYgY2xhc3M9XCJlbW9qaS1tYXJ0LXByZXZpZXctZGF0YVwiPlxuICAgICAgPGRpdiBjbGFzcz1cImVtb2ppLW1hcnQtcHJldmlldy1uYW1lXCI+e3sgZW1vamlEYXRhLm5hbWUgfX08L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJlbW9qaS1tYXJ0LXByZXZpZXctc2hvcnRuYW1lXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiZW1vamktbWFydC1wcmV2aWV3LXNob3J0bmFtZVwiICpuZ0Zvcj1cImxldCBzaG9ydF9uYW1lIG9mIGVtb2ppRGF0YS5zaG9ydE5hbWVzXCI+XG4gICAgICAgICAgOnt7IHNob3J0X25hbWUgfX06XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cImVtb2ppLW1hcnQtcHJldmlldy1lbW90aWNvbnNcIj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJlbW9qaS1tYXJ0LXByZXZpZXctZW1vdGljb25cIiAqbmdGb3I9XCJsZXQgZW1vdGljb24gb2YgbGlzdGVkRW1vdGljb25zXCI+XG4gICAgICAgICAge3sgZW1vdGljb24gfX1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuXG4gIDxkaXYgY2xhc3M9XCJlbW9qaS1tYXJ0LXByZXZpZXdcIiAqbmdJZj1cIiFlbW9qaVwiPlxuICAgIDxkaXYgY2xhc3M9XCJlbW9qaS1tYXJ0LXByZXZpZXctZW1vamlcIj5cbiAgICAgIDxuZ3gtZW1vamkgKm5nSWY9XCJpZGxlRW1vamkgJiYgaWRsZUVtb2ppLmxlbmd0aFwiXG4gICAgICAgIFtpc05hdGl2ZV09XCJlbW9qaUlzTmF0aXZlXCJcbiAgICAgICAgW3NraW5dPVwiZW1vamlTa2luXCJcbiAgICAgICAgW3NldF09XCJlbW9qaVNldFwiXG4gICAgICAgIFtlbW9qaV09XCJpZGxlRW1vamlcIlxuICAgICAgICBbYmFja2dyb3VuZEltYWdlRm5dPVwiZW1vamlCYWNrZ3JvdW5kSW1hZ2VGblwiXG4gICAgICAgIFtzaXplXT1cIjM4XCJcbiAgICAgID48L25neC1lbW9qaT5cbiAgICA8L2Rpdj5cblxuICAgIDxkaXYgY2xhc3M9XCJlbW9qaS1tYXJ0LXByZXZpZXctZGF0YVwiPlxuICAgICAgPHNwYW4gY2xhc3M9XCJlbW9qaS1tYXJ0LXRpdGxlLWxhYmVsXCI+e3sgdGl0bGUgfX08L3NwYW4+XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzPVwiZW1vamktbWFydC1wcmV2aWV3LXNraW5zXCI+XG4gICAgICA8ZW1vamktc2tpbnMgW3NraW5dPVwiZW1vamlTa2luXCIgKGNoYW5nZVNraW4pPVwic2tpbkNoYW5nZS5lbWl0KCRldmVudClcIiBbaTE4bl09XCJpMThuXCI+XG4gICAgICA8L2Vtb2ppLXNraW5zPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbiAgYCxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxufSlcbmV4cG9ydCBjbGFzcyBQcmV2aWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcbiAgQElucHV0KCkgdGl0bGU/OiBzdHJpbmc7XG4gIEBJbnB1dCgpIGVtb2ppOiBhbnk7XG4gIEBJbnB1dCgpIGlkbGVFbW9qaTogYW55O1xuICBASW5wdXQoKSBpMThuOiBhbnk7XG4gIEBJbnB1dCgpIGVtb2ppSXNOYXRpdmU/OiBFbW9qaVsnaXNOYXRpdmUnXTtcbiAgQElucHV0KCkgZW1vamlTa2luPzogRW1vamlbJ3NraW4nXTtcbiAgQElucHV0KCkgZW1vamlTaXplPzogRW1vamlbJ3NpemUnXTtcbiAgQElucHV0KCkgZW1vamlTZXQ/OiBFbW9qaVsnc2V0J107XG4gIEBJbnB1dCgpIGVtb2ppU2hlZXRTaXplPzogRW1vamlbJ3NoZWV0U2l6ZSddO1xuICBASW5wdXQoKSBlbW9qaUJhY2tncm91bmRJbWFnZUZuPzogRW1vamlbJ2JhY2tncm91bmRJbWFnZUZuJ107XG4gIEBPdXRwdXQoKSBza2luQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XG4gIGVtb2ppRGF0YTogUGFydGlhbDxFbW9qaURhdGE+ID0ge307XG4gIGxpc3RlZEVtb3RpY29ucz86IHN0cmluZ1tdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyByZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgZW1vamlTZXJ2aWNlOiBFbW9qaVNlcnZpY2UsXG4gICkge31cblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICBpZiAoIXRoaXMuZW1vamkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5lbW9qaURhdGEgPSB0aGlzLmVtb2ppU2VydmljZS5nZXREYXRhKHRoaXMuZW1vamksIHRoaXMuZW1vamlTa2luLCB0aGlzLmVtb2ppU2V0KSBhcyBFbW9qaURhdGE7XG4gICAgY29uc3Qga25vd25FbW90aWNvbnM6IHN0cmluZ1tdID0gW107XG4gICAgY29uc3QgbGlzdGVkRW1vdGljb25zOiBzdHJpbmdbXSA9IFtdO1xuICAgIGNvbnN0IGVtb2l0Y29ucyA9IHRoaXMuZW1vamlEYXRhLmVtb3RpY29ucyB8fCBbXTtcbiAgICBlbW9pdGNvbnMuZm9yRWFjaCgoZW1vdGljb246IHN0cmluZykgPT4ge1xuICAgICAgaWYgKGtub3duRW1vdGljb25zLmluZGV4T2YoZW1vdGljb24udG9Mb3dlckNhc2UoKSkgPj0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBrbm93bkVtb3RpY29ucy5wdXNoKGVtb3RpY29uLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgbGlzdGVkRW1vdGljb25zLnB1c2goZW1vdGljb24pO1xuICAgIH0pO1xuICAgIHRoaXMubGlzdGVkRW1vdGljb25zID0gbGlzdGVkRW1vdGljb25zO1xuICB9XG59XG4iXX0=
