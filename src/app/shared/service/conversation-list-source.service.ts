import { Conversation } from "@model/application/conversation.interface";
import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { ChangeDetectorRef } from '@angular/core';

export class ConversationListSourceService extends DataSource<Conversation> {
  public pageSize = 10;
  public cachedData = Array.from<Conversation>({ length: this.length });
  public latestList: Conversation[] = [];
  private fetchedPages = new Set<number>();
  public dataStream = new BehaviorSubject<Conversation[]>(this.cachedData);
  private subscription = new Subscription();

  constructor(
    public length: number,
    private cdr: ChangeDetectorRef,
    private ajax: (page: number, list: ConversationListSourceService) => void
  ) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<Conversation[]> {
    this.subscription.add(
      collectionViewer.viewChange.subscribe((range) => {
        const startPage = this.getPageForIndex(range.start);
        const endPage = this.getPageForIndex(range.end - 1);
        for (let i = startPage; i <= endPage; i++) {
          this.fetchPage(i);
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        }
      })
    );
    return this.dataStream;
  }

  disconnect(): void {
    this.subscription.unsubscribe();
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  filter(fn: (item: Conversation | null) => any) {
    return this.cachedData.filter((each) => fn(each));
  }

  unshift(item: Conversation) {
    this.cachedData.unshift(item);
    this.length++;
    this.dataStream.next(this.cachedData);
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  private getPageForIndex(index: number): number {
    return Math.floor(index / this.pageSize);
  }

  private fetchPage(page: number): void {
    if (this.fetchedPages.has(page)) {
      this.cdr.markForCheck();
      this.cdr.detectChanges();
      return;
    }
    this.fetchedPages.add(page);
    this.ajax(page, this);
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }
}
