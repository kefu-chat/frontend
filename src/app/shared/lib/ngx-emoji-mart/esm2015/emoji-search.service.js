import { Injectable } from "@angular/core";
import { categories, EmojiService } from "@shared/lib/ngx-emoji-mart/ngx-emoji";
import { intersect } from "./utils";
import * as i0 from "@angular/core";
import * as i1 from "@shared/lib/ngx-emoji-mart/ngx-emoji";
export class EmojiSearch {
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
        categories.forEach((category) => {
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
EmojiSearch.ɵprov = i0.ɵɵdefineInjectable({
  factory: function EmojiSearch_Factory() {
    return new EmojiSearch(i0.ɵɵinject(i1.EmojiService));
  },
  token: EmojiSearch,
  providedIn: "root",
});
EmojiSearch.decorators = [{ type: Injectable, args: [{ providedIn: "root" }] }];
EmojiSearch.ctorParameters = () => [{ type: EmojiService }];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1vamktc2VhcmNoLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbGliL3BpY2tlci9lbW9qaS1zZWFyY2guc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFDTCxVQUFVLEVBRVYsWUFBWSxHQUNiLE1BQU0sZ0NBQWdDLENBQUM7QUFDeEMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLFNBQVMsQ0FBQzs7O0FBR3BDLE1BQU0sT0FBTyxXQUFXO0lBV3RCLFlBQW9CLFlBQTBCO1FBQTFCLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBVjlDLGlCQUFZLEdBQVEsRUFBRSxDQUFDO1FBQ3ZCLFVBQUssR0FJRCxFQUFFLENBQUM7UUFDUCxlQUFVLEdBQVEsRUFBRSxDQUFDO1FBQ3JCLGtCQUFhLEdBQThCLEVBQUUsQ0FBQztRQUM5QyxnQkFBVyxHQUE4QixFQUFFLENBQUM7UUFHMUMsS0FBSyxNQUFNLFNBQVMsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRTtZQUNoRCxNQUFNLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxHQUFHLFNBQVMsQ0FBQztZQUM1QyxNQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFekIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDM0IsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxFQUFFO29CQUNoQyxPQUFPO2lCQUNSO2dCQUVELElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3BDLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1lB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QUFDO3FCQUNoQjtnQkFDSCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDO1FBRUYsV0FBVyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM5QixXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hCLFdBQVcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdEIsV0FBVyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM1QixXQUFXLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRTlCLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxQixDQUFDOzs7O1lBcE9GLFVBQVUsU0FBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUU7OztZQUpoQyxZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge1xuICBjYXRlZ29yaWVzLFxuICBFbW9qaURhdGEsXG4gIEVtb2ppU2VydmljZSxcbn0gZnJvbSAnQGN0cmwvbmd4LWVtb2ppLW1hcnQvbmd4LWVtb2ppJztcbmltcG9ydCB7IGludGVyc2VjdCB9IGZyb20gJy4vdXRpbHMnO1xuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIEVtb2ppU2VhcmNoIHtcbiAgb3JpZ2luYWxQb29sOiBhbnkgPSB7fTtcbiAgaW5kZXg6IHtcbiAgICByZXN1bHRzPzogRW1vamlEYXRhW107XG4gICAgcG9vbD86IHsgW2tleTogc3RyaW5nXTogRW1vamlEYXRhIH07XG4gICAgW2tleTogc3RyaW5nXTogYW55O1xuICB9ID0ge307XG4gIGVtb2ppc0xpc3Q6IGFueSA9IHt9O1xuICBlbW90aWNvbnNMaXN0OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG4gIGVtb2ppU2VhcmNoOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbW9qaVNlcnZpY2U6IEVtb2ppU2VydmljZSkge1xuICAgIGZvciAoY29uc3QgZW1vamlEYXRhIG9mIHRoaXMuZW1vamlTZXJ2aWNlLmVtb2ppcykge1xuICAgICAgY29uc3QgeyBzaG9ydE5hbWVzLCBlbW90aWNvbnMgfSA9IGVtb2ppRGF0YTtcbiAgICAgIGNvbnN0IGlkID0gc2hvcnROYW1lc1swXTtcblxuICAgICAgZW1vdGljb25zLmZvckVhY2goZW1vdGljb24gPT4ge1xuICAgICAgICBpZiAodGhpcy5lbW90aWNvbnNMaXN0W2Vtb3RpY29uXSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZW1vdGljb25zTGlzdFtlbW90aWNvbl0gPSBpZDtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmVtb2ppc0xpc3RbaWRdID0gdGhpcy5lbW9qaVNlcnZpY2UuZ2V0U2FuaXRpemVkRGF0YShpZCk7XG4gICAgICB0aGlzLm9yaWdpbmFsUG9vbFtpZF0gPSBlbW9qaURhdGE7XG4gICAgfVxuICB9XG5cbiAgYWRkQ3VzdG9tVG9Qb29sKGN1c3RvbTogYW55LCBwb29sOiBhbnkpIHtcbiAgICBjdXN0b20uZm9yRWFjaCgoZW1vamk6IGFueSkgPT4ge1xuICAgICAgY29uc3QgZW1vamlJZCA9IGVtb2ppLmlkIHx8IGVtb2ppLnNob3J0TmFtZXNbMF07XG5cbiAgICAgIGlmIChlbW9qaUlkICYmICFwb29sW2Vtb2ppSWRdKSB7XG4gICAgICAgIHBvb2xbZW1vamlJZF0gPSB0aGlzLmVtb2ppU2VydmljZS5nZXREYXRhKGVtb2ppKTtcbiAgICAgICAgdGhpcy5lbW9qaXNMaXN0W2Vtb2ppSWRdID0gdGhpcy5lbW9qaVNlcnZpY2UuZ2V0U2FuaXRpemVkRGF0YShlbW9qaSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzZWFyY2goXG4gICAgdmFsdWU6IHN0cmluZyxcbiAgICBlbW9qaXNUb1Nob3dGaWx0ZXI/OiAoeDogYW55KSA9PiBib29sZWFuLFxuICAgIG1heFJlc3VsdHMgPSA3NSxcbiAgICBpbmNsdWRlOiBhbnlbXSA9IFtdLFxuICAgIGV4Y2x1ZGU6IGFueVtdID0gW10sXG4gICAgY3VzdG9tOiBhbnlbXSA9IFtdLFxuICApOiBFbW9qaURhdGFbXSB8IG51bGwge1xuICAgIHRoaXMuYWRkQ3VzdG9tVG9Qb29sKGN1c3RvbSwgdGhpcy5vcmlnaW5hbFBvb2wpO1xuXG4gICAgbGV0IHJlc3VsdHM6IEVtb2ppRGF0YVtdIHwgdW5kZWZpbmVkO1xuICAgIGxldCBwb29sID0gdGhpcy5vcmlnaW5hbFBvb2w7XG5cbiAgICBpZiAodmFsdWUubGVuZ3RoKSB7XG4gICAgICBpZiAodmFsdWUgPT09ICctJyB8fCB2YWx1ZSA9PT0gJy0xJykge1xuICAgICAgICByZXR1cm4gW3RoaXMuZW1vamlzTGlzdFsnLTEnXV07XG4gICAgICB9XG4gICAgICBpZiAodmFsdWUgPT09ICcrJyB8fCB2YWx1ZSA9PT0gJysxJykge1xuICAgICAgICByZXR1cm4gW3RoaXMuZW1vamlzTGlzdFsnKzEnXV07XG4gICAgICB9XG5cbiAgICAgIGxldCB2YWx1ZXMgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpLnNwbGl0KC9bXFxzfCx8XFwtfF9dKy8pO1xuICAgICAgbGV0IGFsbFJlc3VsdHMgPSBbXTtcblxuICAgICAgaWYgKHZhbHVlcy5sZW5ndGggPiAyKSB7XG4gICAgICAgIHZhbHVlcyA9IFt2YWx1ZXNbMF0sIHZhbHVlc1sxXV07XG4gICAgICB9XG5cbiAgICAgIGlmIChpbmNsdWRlLmxlbmd0aCB8fCBleGNsdWRlLmxlbmd0aCkge1xuICAgICAgICBwb29sID0ge307XG5cbiAgICAgICAgY2F0ZWdvcmllcy5mb3JFYWNoKGNhdGVnb3J5ID0+IHtcbiAgICAgICAgICBjb25zdCBpc0luY2x1ZGVkID1cbiAgICAgICAgICAgIGluY2x1ZGUgJiYgaW5jbHVkZS5sZW5ndGhcbiAgICAgICAgICAgICAgPyBpbmNsdWRlLmluZGV4T2YoY2F0ZWdvcnkuaWQpID4gLTFcbiAgICAgICAgICAgICAgOiB0cnVlO1xuICAgICAgICAgIGNvbnN0IGlzRXhjbHVkZWQgPVxuICAgICAgICAgICAgZXhjbHVkZSAmJiBleGNsdWRlLmxlbmd0aFxuICAgICAgICAgICAgICA/IGV4Y2x1ZGUuaW5kZXhPZihjYXRlZ29yeS5pZCkgPiAtMVxuICAgICAgICAgICAgICA6IGZhbHNlO1xuICAgICAgICAgIGlmICghaXNJbmNsdWRlZCB8fCBpc0V4Y2x1ZGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY2F0ZWdvcnkuZW1vamlzPy5mb3JFYWNoKFxuICAgICAgICAgICAgZW1vamlJZCA9PiB7XG4gICAgICAgICAgICAgIC8vIE5lZWQgdG8gbWFrZSBzdXJlIHRoYXQgcG9vbCBnZXRzIGtleWVkXG4gICAgICAgICAgICAgIC8vIHdpdGggdGhlIGNvcnJlY3QgaWQsIHdoaWNoIGlzIHdoeSB3ZSBjYWxsIGVtb2ppU2VydmljZS5nZXREYXRhIGJlbG93XG4gICAgICAgICAgICAgIGNvbnN0IGVtb2ppID0gdGhpcy5lbW9qaVNlcnZpY2UuZ2V0RGF0YShlbW9qaUlkKTtcbiAgICAgICAgICAgICAgcG9vbFtlbW9qaT8uaWQgPz8gJyddID0gZW1vamk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGN1c3RvbS5sZW5ndGgpIHtcbiAgICAgICAgICBjb25zdCBjdXN0b21Jc0luY2x1ZGVkID1cbiAgICAgICAgICAgIGluY2x1ZGUgJiYgaW5jbHVkZS5sZW5ndGggPyBpbmNsdWRlLmluZGV4T2YoJ2N1c3RvbScpID4gLTEgOiB0cnVlO1xuICAgICAgICAgIGNvbnN0IGN1c3RvbUlzRXhjbHVkZWQgPVxuICAgICAgICAgICAgZXhjbHVkZSAmJiBleGNsdWRlLmxlbmd0aCA/IGV4Y2x1ZGUuaW5kZXhPZignY3VzdG9tJykgPiAtMSA6IGZhbHNlO1xuICAgICAgICAgIGlmIChjdXN0b21Jc0luY2x1ZGVkICYmICFjdXN0b21Jc0V4Y2x1ZGVkKSB7XG4gICAgICAgICAgICB0aGlzLmFkZEN1c3RvbVRvUG9vbChjdXN0b20sIHBvb2wpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBhbGxSZXN1bHRzID0gdmFsdWVzXG4gICAgICAgIC5tYXAodiA9PiB7XG4gICAgICAgICAgbGV0IGFQb29sID0gcG9vbDtcbiAgICAgICAgICBsZXQgYUluZGV4ID0gdGhpcy5pbmRleDtcbiAgICAgICAgICBsZXQgbGVuZ3RoID0gMDtcblxuICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogcHJlZmVyLWZvci1vZlxuICAgICAgICAgIGZvciAobGV0IGNoYXJJbmRleCA9IDA7IGNoYXJJbmRleCA8IHYubGVuZ3RoOyBjaGFySW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3QgY2hhciA9IHZbY2hhckluZGV4XTtcbiAgICAgICAgICAgIGxlbmd0aCsrO1xuICAgICAgICAgICAgaWYgKCFhSW5kZXhbY2hhcl0pIHtcbiAgICAgICAgICAgICAgYUluZGV4W2NoYXJdID0ge307XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhSW5kZXggPSBhSW5kZXhbY2hhcl07XG5cbiAgICAgICAgICAgIGlmICghYUluZGV4LnJlc3VsdHMpIHtcbiAgICAgICAgICAgICAgY29uc3Qgc2NvcmVzOiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9ID0ge307XG5cbiAgICAgICAgICAgICAgYUluZGV4LnJlc3VsdHMgPSBbXTtcbiAgICAgICAgICAgICAgYUluZGV4LnBvb2wgPSB7fTtcblxuICAgICAgICAgICAgICBmb3IgKGNvbnN0IGlkIG9mIE9iamVjdC5rZXlzKGFQb29sKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVtb2ppID0gYVBvb2xbaWRdO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5lbW9qaVNlYXJjaFtpZF0pIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuZW1vamlTZWFyY2hbaWRdID0gdGhpcy5idWlsZFNlYXJjaChcbiAgICAgICAgICAgICAgICAgICAgZW1vamkuc2hvcnRfbmFtZXMsXG4gICAgICAgICAgICAgICAgICAgIGVtb2ppLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGVtb2ppLmlkLFxuICAgICAgICAgICAgICAgICAgICBlbW9qaS5rZXl3b3JkcyxcbiAgICAgICAgICAgICAgICAgICAgZW1vamkuZW1vdGljb25zXG4gICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBxdWVyeSA9IHRoaXMuZW1vamlTZWFyY2hbaWRdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN1YiA9IHYuc3Vic3RyKDAsIGxlbmd0aCk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3ViSW5kZXggPSBxdWVyeS5pbmRleE9mKHN1Yik7XG5cbiAgICAgICAgICAgICAgICBpZiAoc3ViSW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICBsZXQgc2NvcmUgPSBzdWJJbmRleCArIDE7XG4gICAgICAgICAgICAgICAgICBpZiAoc3ViID09PSBpZCkge1xuICAgICAgICAgICAgICAgICAgICBzY29yZSA9IDA7XG4gICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgIGFJbmRleC5yZXN1bHRzLnB1c2godGhpcy5lbW9qaXNMaXN0W2lkXSk7XG4gICAgICAgICAgICAgICAgICBhSW5kZXgucG9vbFtpZF0gPSBlbW9qaTtcblxuICAgICAgICAgICAgICAgICAgc2NvcmVzW2lkXSA9IHNjb3JlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGFJbmRleC5yZXN1bHRzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhU2NvcmUgPSBzY29yZXNbYS5pZF07XG4gICAgICAgICAgICAgICAgY29uc3QgYlNjb3JlID0gc2NvcmVzW2IuaWRdO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFTY29yZSAtIGJTY29yZTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFQb29sID0gYUluZGV4LnBvb2w7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGFJbmRleC5yZXN1bHRzO1xuICAgICAgICB9KVxuICAgICAgICAuZmlsdGVyKGEgPT4gYSk7XG5cbiAgICAgIGlmIChhbGxSZXN1bHRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgcmVzdWx0cyA9IGludGVyc2VjdC5hcHBseShudWxsLCBhbGxSZXN1bHRzIGFzIGFueSk7XG4gICAgICB9IGVsc2UgaWYgKGFsbFJlc3VsdHMubGVuZ3RoKSB7XG4gICAgICAgIHJlc3VsdHMgPSBhbGxSZXN1bHRzWzBdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChyZXN1bHRzKSB7XG4gICAgICBpZiAoZW1vamlzVG9TaG93RmlsdGVyKSB7XG4gICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcigocmVzdWx0OiBFbW9qaURhdGEpID0+IHtcbiAgICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5pZCkge1xuICAgICAgICAgICAgcmV0dXJuIGVtb2ppc1RvU2hvd0ZpbHRlcih0aGlzLmVtb2ppU2VydmljZS5uYW1lc1tyZXN1bHQuaWRdKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlc3VsdHMgJiYgcmVzdWx0cy5sZW5ndGggPiBtYXhSZXN1bHRzKSB7XG4gICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLnNsaWNlKDAsIG1heFJlc3VsdHMpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cyB8fCBudWxsO1xuICB9XG5cbiAgYnVpbGRTZWFyY2goXG4gICAgc2hvcnROYW1lczogc3RyaW5nW10sXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIGlkOiBzdHJpbmcsXG4gICAga2V5d29yZHM6IHN0cmluZ1tdLFxuICAgIGVtb3RpY29uczogc3RyaW5nW10sXG4gICkge1xuICAgIGNvbnN0IHNlYXJjaDogc3RyaW5nW10gPSBbXTtcblxuICAgIGNvbnN0IGFkZFRvU2VhcmNoID0gKHN0cmluZ3M6IHN0cmluZyB8IHN0cmluZ1tdLCBzcGxpdDogYm9vbGVhbikgPT4ge1xuICAgICAgaWYgKCFzdHJpbmdzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgKEFycmF5LmlzQXJyYXkoc3RyaW5ncykgPyBzdHJpbmdzIDogW3N0cmluZ3NdKS5mb3JFYWNoKHN0ciA9PiB7XG4gICAgICAgIChzcGxpdCA/IHN0ci5zcGxpdCgvWy18X3xcXHNdKy8pIDogW3N0cl0pLmZvckVhY2gocyA9PiB7XG4gICAgICAgICAgcyA9IHMudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICAgIGlmICghc2VhcmNoLmluY2x1ZGVzKHMpKSB7XG4gICAgICAgICAgICBzZWFyY2gucHVzaChzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGFkZFRvU2VhcmNoKHNob3J0TmFtZXMsIHRydWUpO1xuICAgIGFkZFRvU2VhcmNoKG5hbWUsIHRydWUpO1xuICAgIGFkZFRvU2VhcmNoKGlkLCB0cnVlKTtcbiAgICBhZGRUb1NlYXJjaChrZXl3b3JkcywgdHJ1ZSk7XG4gICAgYWRkVG9TZWFyY2goZW1vdGljb25zLCBmYWxzZSk7XG5cbiAgICByZXR1cm4gc2VhcmNoLmpvaW4oJywnKTtcbiAgfVxufVxuIl19
