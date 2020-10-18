import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, } from '@angular/core';
export class AnchorsComponent {
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
    { type: Component, args: [{
                selector: 'emoji-mart-anchors',
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
                preserveWhitespaces: false
            },] }
];
AnchorsComponent.propDecorators = {
    categories: [{ type: Input }],
    color: [{ type: Input }],
    selected: [{ type: Input }],
    i18n: [{ type: Input }],
    icons: [{ type: Input }],
    anchorClick: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5jaG9ycy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbGliL3BpY2tlci9hbmNob3JzLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUNMLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQThCdkIsTUFBTSxPQUFPLGdCQUFnQjtJQTFCN0I7UUEyQlcsZUFBVSxHQUFvQixFQUFFLENBQUM7UUFJakMsVUFBSyxHQUE4QixFQUFFLENBQUM7UUFDckMsZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBOEMsQ0FBQztJQVd6RixDQUFDO0lBVEMsU0FBUyxDQUFDLEdBQVcsRUFBRSxHQUFrQjtRQUN2QyxPQUFPLEdBQUcsQ0FBQyxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUNELFdBQVcsQ0FBQyxNQUFhLEVBQUUsS0FBYTtRQUN0QyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztZQUNwQixRQUFRLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7WUFDaEMsS0FBSztTQUNOLENBQUMsQ0FBQztJQUNMLENBQUM7OztZQTFDRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLG9CQUFvQjtnQkFDOUIsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW9CVDtnQkFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsbUJBQW1CLEVBQUUsS0FBSzthQUMzQjs7O3lCQUVFLEtBQUs7b0JBQ0wsS0FBSzt1QkFDTCxLQUFLO21CQUNMLEtBQUs7b0JBQ0wsS0FBSzswQkFDTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRW1vamlDYXRlZ29yeSB9IGZyb20gJ0BjdHJsL25neC1lbW9qaS1tYXJ0L25neC1lbW9qaSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Vtb2ppLW1hcnQtYW5jaG9ycycsXG4gIHRlbXBsYXRlOiBgXG4gIDxkaXYgY2xhc3M9XCJlbW9qaS1tYXJ0LWFuY2hvcnNcIj5cbiAgICA8bmctdGVtcGxhdGUgbmdGb3IgbGV0LWNhdGVnb3J5IFtuZ0Zvck9mXT1cImNhdGVnb3JpZXNcIiBsZXQtaWR4PVwiaW5kZXhcIiBbbmdGb3JUcmFja0J5XT1cInRyYWNrQnlGblwiPlxuICAgICAgPHNwYW5cbiAgICAgICAgKm5nSWY9XCJjYXRlZ29yeS5hbmNob3IgIT09IGZhbHNlXCJcbiAgICAgICAgW2F0dHIudGl0bGVdPVwiaTE4bi5jYXRlZ29yaWVzW2NhdGVnb3J5LmlkXVwiXG4gICAgICAgIChjbGljayk9XCJ0aGlzLmhhbmRsZUNsaWNrKCRldmVudCwgaWR4KVwiXG4gICAgICAgIGNsYXNzPVwiZW1vamktbWFydC1hbmNob3JcIlxuICAgICAgICBbY2xhc3MuZW1vamktbWFydC1hbmNob3Itc2VsZWN0ZWRdPVwiY2F0ZWdvcnkubmFtZSA9PT0gc2VsZWN0ZWRcIlxuICAgICAgICBbc3R5bGUuY29sb3JdPVwiY2F0ZWdvcnkubmFtZSA9PT0gc2VsZWN0ZWQgPyBjb2xvciA6IG51bGxcIlxuICAgICAgPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIj5cbiAgICAgICAgICAgIDxwYXRoIFthdHRyLmRdPVwiaWNvbnNbY2F0ZWdvcnkuaWRdXCIgLz5cbiAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiZW1vamktbWFydC1hbmNob3ItYmFyXCIgW3N0eWxlLmJhY2tncm91bmQtY29sb3JdPVwiY29sb3JcIj48L3NwYW4+XG4gICAgICA8L3NwYW4+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgPC9kaXY+XG4gIGAsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBmYWxzZSxcbn0pXG5leHBvcnQgY2xhc3MgQW5jaG9yc0NvbXBvbmVudCB7XG4gIEBJbnB1dCgpIGNhdGVnb3JpZXM6IEVtb2ppQ2F0ZWdvcnlbXSA9IFtdO1xuICBASW5wdXQoKSBjb2xvcj86IHN0cmluZztcbiAgQElucHV0KCkgc2VsZWN0ZWQ/OiBzdHJpbmc7XG4gIEBJbnB1dCgpIGkxOG46IGFueTtcbiAgQElucHV0KCkgaWNvbnM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcbiAgQE91dHB1dCgpIGFuY2hvckNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjx7IGNhdGVnb3J5OiBFbW9qaUNhdGVnb3J5LCBpbmRleDogbnVtYmVyIH0+KCk7XG5cbiAgdHJhY2tCeUZuKGlkeDogbnVtYmVyLCBjYXQ6IEVtb2ppQ2F0ZWdvcnkpIHtcbiAgICByZXR1cm4gY2F0LmlkO1xuICB9XG4gIGhhbmRsZUNsaWNrKCRldmVudDogRXZlbnQsIGluZGV4OiBudW1iZXIpIHtcbiAgICB0aGlzLmFuY2hvckNsaWNrLmVtaXQoe1xuICAgICAgY2F0ZWdvcnk6IHRoaXMuY2F0ZWdvcmllc1tpbmRleF0sXG4gICAgICBpbmRleCxcbiAgICB9KTtcbiAgfVxufVxuIl19