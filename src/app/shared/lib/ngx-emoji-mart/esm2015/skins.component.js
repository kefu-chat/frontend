import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, } from '@angular/core';
export class SkinComponent {
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
        return this.opened ? !!this.isSelected(skinTone) : '';
    }
    tabIndex(skinTone) {
        return this.isVisible(skinTone) ? '0' : '';
    }
    expanded(skinTone) {
        return this.isSelected(skinTone) ? this.opened : '';
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
    { type: Component, args: [{
                selector: 'emoji-skins',
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
                preserveWhitespaces: false
            },] }
];
SkinComponent.propDecorators = {
    skin: [{ type: Input }],
    i18n: [{ type: Input }],
    changeSkin: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tpbnMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9waWNrZXIvc2tpbnMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFlBQVksRUFDWixLQUFLLEVBQ0wsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBb0N2QixNQUFNLE9BQU8sYUFBYTtJQWhDMUI7UUFvQ1ksZUFBVSxHQUFHLElBQUksWUFBWSxFQUFVLENBQUM7UUFDbEQsV0FBTSxHQUFHLEtBQUssQ0FBQztRQUNmLGNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFvQ2pDLENBQUM7SUFsQ0MsVUFBVTtRQUNSLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQzdCLENBQUM7SUFFRCxVQUFVLENBQUMsUUFBdUI7UUFDaEMsT0FBTyxRQUFRLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQztJQUNoQyxDQUFDO0lBRUQsU0FBUyxDQUFDLFFBQXVCO1FBQy9CLE9BQU8sSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRCxPQUFPLENBQUMsUUFBdUI7UUFDN0IsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ3hELENBQUM7SUFFRCxRQUFRLENBQUMsUUFBdUI7UUFDOUIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUM3QyxDQUFDO0lBRUQsUUFBUSxDQUFDLFFBQXVCO1FBQzlCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ3RELENBQUM7SUFFRCxXQUFXLENBQUMsSUFBWTtRQUN0QixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNoQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztZQUNuQixPQUFPO1NBQ1I7UUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwQixJQUFJLElBQUksS0FBSyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzVCO0lBQ0gsQ0FBQzs7O1lBekVGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsYUFBYTtnQkFDdkIsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTBCVDtnQkFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsbUJBQW1CLEVBQUUsS0FBSzthQUMzQjs7O21CQUdFLEtBQUs7bUJBQ0wsS0FBSzt5QkFDTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRW1vamkgfSBmcm9tICdAY3RybC9uZ3gtZW1vamktbWFydC9uZ3gtZW1vamknO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdlbW9qaS1za2lucycsXG4gIHRlbXBsYXRlOiBgXG4gICAgPHNlY3Rpb25cbiAgICAgIGNsYXNzPVwiZW1vamktbWFydC1za2luLXN3YXRjaGVzXCJcbiAgICAgIFtjbGFzcy5vcGVuZWRdPVwib3BlbmVkXCJcbiAgICA+XG4gICAgICA8c3BhblxuICAgICAgICAqbmdGb3I9XCJsZXQgc2tpblRvbmUgb2Ygc2tpblRvbmVzXCJcbiAgICAgICAgY2xhc3M9XCJlbW9qaS1tYXJ0LXNraW4tc3dhdGNoXCJcbiAgICAgICAgW2NsYXNzLnNlbGVjdGVkXT1cInNraW5Ub25lID09PSBza2luXCJcbiAgICAgID5cbiAgICAgICAgPHNwYW5cbiAgICAgICAgICAoY2xpY2spPVwidGhpcy5oYW5kbGVDbGljayhza2luVG9uZSlcIlxuICAgICAgICAgIChrZXl1cC5lbnRlcik9XCJoYW5kbGVDbGljayhza2luVG9uZSlcIlxuICAgICAgICAgIChrZXl1cC5zcGFjZSk9XCJoYW5kbGVDbGljayhza2luVG9uZSlcIlxuICAgICAgICAgIGNsYXNzPVwiZW1vamktbWFydC1za2luIGVtb2ppLW1hcnQtc2tpbi10b25lLXt7IHNraW5Ub25lIH19XCJcbiAgICAgICAgICByb2xlPVwiYnV0dG9uXCJcbiAgICAgICAgICBbdGFiSW5kZXhdPVwidGFiSW5kZXgoc2tpblRvbmUpXCJcbiAgICAgICAgICBbYXR0ci5hcmlhLWhpZGRlbl09XCIhaXNWaXNpYmxlKHNraW5Ub25lKVwiXG4gICAgICAgICAgW2F0dHIuYXJpYS1wcmVzc2VkXT1cInByZXNzZWQoc2tpblRvbmUpXCJcbiAgICAgICAgICBbYXR0ci5hcmlhLWhhc3BvcHVwXT1cIiEhaXNTZWxlY3RlZChza2luVG9uZSlcIlxuICAgICAgICAgIFthdHRyLmFyaWEtZXhwYW5kZWRdPVwiZXhwYW5kZWQoc2tpblRvbmUpXCJcbiAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImkxOG4uc2tpbnRvbmVzW3NraW5Ub25lXVwiXG4gICAgICAgICAgW3RpdGxlXT1cImkxOG4uc2tpbnRvbmVzW3NraW5Ub25lXVwiXG4gICAgICAgID48L3NwYW4+XG4gICAgICA8L3NwYW4+XG4gICAgPC9zZWN0aW9uPlxuICBgLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXG59KVxuZXhwb3J0IGNsYXNzIFNraW5Db21wb25lbnQge1xuICAvKiogY3VycmVudGx5IHNlbGVjdGVkIHNraW4gKi9cbiAgQElucHV0KCkgc2tpbj86IEVtb2ppWydza2luJ107XG4gIEBJbnB1dCgpIGkxOG46IGFueTtcbiAgQE91dHB1dCgpIGNoYW5nZVNraW4gPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcbiAgb3BlbmVkID0gZmFsc2U7XG4gIHNraW5Ub25lcyA9IFsxLCAyLCAzLCA0LCA1LCA2XTtcblxuICB0b2dnbGVPcGVuKCkge1xuICAgIHRoaXMub3BlbmVkID0gIXRoaXMub3BlbmVkO1xuICB9XG5cbiAgaXNTZWxlY3RlZChza2luVG9uZTogRW1vamlbJ3NraW4nXSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBza2luVG9uZSA9PT0gdGhpcy5za2luO1xuICB9XG5cbiAgaXNWaXNpYmxlKHNraW5Ub25lOiBFbW9qaVsnc2tpbiddKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMub3BlbmVkIHx8IHRoaXMuaXNTZWxlY3RlZChza2luVG9uZSk7XG4gIH1cblxuICBwcmVzc2VkKHNraW5Ub25lOiBFbW9qaVsnc2tpbiddKSB7XG4gICAgcmV0dXJuIHRoaXMub3BlbmVkID8gISF0aGlzLmlzU2VsZWN0ZWQoc2tpblRvbmUpIDogJyc7XG4gIH1cblxuICB0YWJJbmRleChza2luVG9uZTogRW1vamlbJ3NraW4nXSkge1xuICAgIHJldHVybiB0aGlzLmlzVmlzaWJsZShza2luVG9uZSkgPyAnMCcgOiAnJztcbiAgfVxuXG4gIGV4cGFuZGVkKHNraW5Ub25lOiBFbW9qaVsnc2tpbiddKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNTZWxlY3RlZChza2luVG9uZSkgPyB0aGlzLm9wZW5lZCA6ICcnO1xuICB9XG5cbiAgaGFuZGxlQ2xpY2soc2tpbjogbnVtYmVyKSB7XG4gICAgaWYgKCF0aGlzLm9wZW5lZCkge1xuICAgICAgdGhpcy5vcGVuZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLm9wZW5lZCA9IGZhbHNlO1xuICAgIGlmIChza2luICE9PSB0aGlzLnNraW4pIHtcbiAgICAgIHRoaXMuY2hhbmdlU2tpbi5lbWl0KHNraW4pO1xuICAgIH1cbiAgfVxufVxuIl19