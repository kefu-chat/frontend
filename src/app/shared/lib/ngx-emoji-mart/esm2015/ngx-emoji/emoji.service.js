import { Injectable } from "@angular/core";
import { emojis } from "./data/emojis";
import * as i0 from "@angular/core";
const COLONS_REGEX = /^(?:\:([^\:]+)\:)(?:\:skin-tone-(\d)\:)?$/;
const SKINS = ["1F3FA", "1F3FB", "1F3FC", "1F3FD", "1F3FE", "1F3FF"];
export const DEFAULT_BACKGROUNDFN = (set, sheetSize) => `/assets/emoji/64.png`;
export class EmojiService {
  constructor() {
    this.uncompressed = false;
    this.names = {};
    this.emojis = [];
    if (!this.uncompressed) {
      this.uncompress(emojis);
      this.uncompressed = true;
    }
  }
  uncompress(list) {
    this.emojis = list.map((emoji) => {
      const data = Object.assign({}, emoji);
      if (!data.shortNames) {
        data.shortNames = [];
      }
      data.shortNames.unshift(data.shortName);
      data.id = data.shortName;
      data.native = this.unifiedToNative(data.unified);
      if (!data.skinVariations) {
        data.skinVariations = [];
      }
      if (!data.keywords) {
        data.keywords = [];
      }
      if (!data.emoticons) {
        data.emoticons = [];
      }
      if (!data.hidden) {
        data.hidden = [];
      }
      if (!data.text) {
        data.text = "";
      }
      if (data.obsoletes) {
        // get keywords from emoji that it obsoletes since that is shared
        const f = list.find((x) => x.unified === data.obsoletes);
        if (f) {
          if (f.keywords) {
            data.keywords = [...data.keywords, ...f.keywords, f.shortName];
          } else {
            data.keywords = [...data.keywords, f.shortName];
          }
        }
      }
      this.names[data.unified] = data;
      for (const n of data.shortNames) {
        this.names[n] = data;
      }
      return data;
    });
  }
  getData(emoji, skin, set) {
    let emojiData;
    if (typeof emoji === "string") {
      const matches = emoji.match(COLONS_REGEX);
      if (matches) {
        emoji = matches[1];
        if (matches[2]) {
          skin = parseInt(matches[2], 10);
        }
      }
      if (this.names.hasOwnProperty(emoji)) {
        emojiData = this.names[emoji];
      } else {
        return null;
      }
    } else if (emoji.id) {
      emojiData = this.names[emoji.id];
    } else if (emoji.unified) {
      emojiData = this.names[emoji.unified.toUpperCase()];
    }
    if (!emojiData) {
      emojiData = emoji;
      emojiData.custom = true;
    }
    const hasSkinVariations =
      emojiData.skinVariations && emojiData.skinVariations.length;
    if (hasSkinVariations && skin && skin > 1 && set) {
      emojiData = Object.assign({}, emojiData);
      const skinKey = SKINS[skin - 1];
      const variationData = emojiData.skinVariations.find((n) =>
        n.unified.includes(skinKey)
      );
      if (!variationData.hidden || !variationData.hidden.includes(set)) {
        emojiData.skinTone = skin;
        emojiData = Object.assign(Object.assign({}, emojiData), variationData);
      }
      emojiData.native = this.unifiedToNative(emojiData.unified);
    }
    emojiData.set = set || "";
    return emojiData;
  }
  unifiedToNative(unified) {
    const codePoints = unified.split("-").map((u) => parseInt(`0x${u}`, 16));
    return String.fromCodePoint(...codePoints);
  }
  emojiSpriteStyles(
    sheet,
    set = "apple",
    size = 24,
    sheetSize = 64,
    sheetRows = 57,
    backgroundImageFn = DEFAULT_BACKGROUNDFN,
    sheetColumns = 57
  ) {
    return {
      width: `${size}px`,
      height: `${size}px`,
      display: "inline-block",
      "background-image": `url(${backgroundImageFn(set, sheetSize)})`,
      "background-size": `${100 * sheetColumns}% ${100 * sheetRows}%`,
      "background-position": this.getSpritePosition(sheet, sheetColumns),
    };
  }
  getSpritePosition(sheet, sheetColumns) {
    const [sheetX, sheetY] = sheet;
    const multiply = 100 / (sheetColumns - 1);
    return `${multiply * sheetX}% ${multiply * sheetY}%`;
  }
  sanitize(emoji) {
    if (emoji === null) {
      return null;
    }
    const id = emoji.id || emoji.shortNames[0];
    let colons = `:${id}:`;
    if (emoji.skinTone) {
      colons += `:skin-tone-${emoji.skinTone}:`;
    }
    emoji.colons = colons;
    return Object.assign({}, emoji);
  }
  getSanitizedData(emoji, skin, set) {
    return this.sanitize(this.getData(emoji, skin, set));
  }
}
EmojiService.ɵprov = i0.ɵɵdefineInjectable({
  factory: function EmojiService_Factory() {
    return new EmojiService();
  },
  token: EmojiService,
  providedIn: "root",
});
EmojiService.decorators = [
  { type: Injectable, args: [{ providedIn: "root" }] },
];
EmojiService.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1vamkuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvcGlja2VyL25neC1lbW9qaS9lbW9qaS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFPM0MsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFHdkMsTUFBTSxZQUFZLEdBQUcsMkNBQTJDLENBQUM7QUFDakUsTUFBTSxLQUFLLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3JFLE1BQU0sQ0FBQyxNQUFNLG9CQUFvQixHQUFHLENBQ2xDLEdBQVcsRUFDWCxTQUFpQixFQUNqQixFQUFFLENBQUMsc0NBQXNDLEdBQUcsY0FBYyxHQUFHLGVBQWUsU0FBUyxNQUFNLENBQUM7QUFHOUYsTUFBTSxPQUFPLFlBQVk7SUFLdkI7UUFKQSxpQkFBWSxHQUFHLEtBQUssQ0FBQztRQUNyQixVQUFLLEdBQWlDLEVBQUUsQ0FBQztRQUN6QyxXQUFNLEdBQWdCLEVBQUUsQ0FBQztRQUd2QixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUN0QixJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1NBQzFCO0lBQ0gsQ0FBQztJQUVELFVBQVUsQ0FBQyxJQUEyQjtRQUNwQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDN0IsTUFBTSxJQUFJLHFCQUFhLEtBQUssQ0FBRSxDQUFDO1lBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNwQixJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQzthQUN0QjtZQUNE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O1NBQ2I7UUFDRCxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0MsSUFBSSxNQUFNLEdBQUcsSUFBSSxFQUFFLEdBQUcsQ0FBQztRQUN2QixJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDbEIsTUFBTSxJQUFJLGNBQWMsS0FBSyxDQUFDLFFBQVEsR0FBRyxDQUFDO1NBQzNDO1FBQ0QsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDdEIseUJBQVksS0FBSyxFQUFHO0lBQ3RCLENBQUM7SUFFRCxnQkFBZ0IsQ0FDZCxLQUF5QixFQUN6QixJQUFvQixFQUNwQixHQUFrQjtRQUVsQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDdkQsQ0FBQzs7OztZQXJLRixVQUFVLFNBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge1xuICBDb21wcmVzc2VkRW1vamlEYXRhLFxuICBFbW9qaURhdGEsXG4gIEVtb2ppVmFyaWF0aW9uLFxufSBmcm9tICcuL2RhdGEvZGF0YS5pbnRlcmZhY2VzJztcbmltcG9ydCB7IGVtb2ppcyB9IGZyb20gJy4vZGF0YS9lbW9qaXMnO1xuaW1wb3J0IHsgRW1vamkgfSBmcm9tICcuL2Vtb2ppLmNvbXBvbmVudCc7XG5cbmNvbnN0IENPTE9OU19SRUdFWCA9IC9eKD86XFw6KFteXFw6XSspXFw6KSg/OlxcOnNraW4tdG9uZS0oXFxkKVxcOik/JC87XG5jb25zdCBTS0lOUyA9IFsnMUYzRkEnLCAnMUYzRkInLCAnMUYzRkMnLCAnMUYzRkQnLCAnMUYzRkUnLCAnMUYzRkYnXTtcbmV4cG9ydCBjb25zdCBERUZBVUxUX0JBQ0tHUk9VTkRGTiA9IChcbiAgc2V0OiBzdHJpbmcsXG4gIHNoZWV0U2l6ZTogbnVtYmVyLFxuKSA9PiBgaHR0cHM6Ly91bnBrZy5jb20vZW1vamktZGF0YXNvdXJjZS0ke3NldH1ANS4wLjEvaW1nLyR7c2V0fS9zaGVldHMtMjU2LyR7c2hlZXRTaXplfS5wbmdgO1xuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIEVtb2ppU2VydmljZSB7XG4gIHVuY29tcHJlc3NlZCA9IGZhbHNlO1xuICBuYW1lczogeyBba2V5OiBzdHJpbmddOiBFbW9qaURhdGEgfSA9IHt9O1xuICBlbW9qaXM6IEVtb2ppRGF0YVtdID0gW107XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgaWYgKCF0aGlzLnVuY29tcHJlc3NlZCkge1xuICAgICAgdGhpcy51bmNvbXByZXNzKGVtb2ppcyk7XG4gICAgICB0aGlzLnVuY29tcHJlc3NlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgdW5jb21wcmVzcyhsaXN0OiBDb21wcmVzc2VkRW1vamlEYXRhW10pIHtcbiAgICB0aGlzLmVtb2ppcyA9IGxpc3QubWFwKGVtb2ppID0+IHtcbiAgICAgIGNvbnN0IGRhdGE6IGFueSA9IHsgLi4uZW1vamkgfTtcbiAgICAgIGlmICghZGF0YS5zaG9ydE5hbWVzKSB7XG4gICAgICAgIGRhdGEuc2hvcnROYW1lcyA9IFtdO1xuICAgICAgfVxuICAgICAgZGF0YS5zaG9ydE5hbWVzLnVuc2hpZnQoZGF0YS5zaG9ydE5hbWUpO1xuICAgICAgZGF0YS5pZCA9IGRhdGEuc2hvcnROYW1lO1xuICAgICAgZGF0YS5uYXRpdmUgPSB0aGlzLnVuaWZpZWRUb05hdGl2ZShkYXRhLnVuaWZpZWQpO1xuXG4gICAgICBpZiAoIWRhdGEuc2tpblZhcmlhdGlvbnMpIHtcbiAgICAgICAgZGF0YS5za2luVmFyaWF0aW9ucyA9IFtdO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWRhdGEua2V5d29yZHMpIHtcbiAgICAgICAgZGF0YS5rZXl3b3JkcyA9IFtdO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWRhdGEuZW1vdGljb25zKSB7XG4gICAgICAgIGRhdGEuZW1vdGljb25zID0gW107XG4gICAgICB9XG5cbiAgICAgIGlmICghZGF0YS5oaWRkZW4pIHtcbiAgICAgICAgZGF0YS5oaWRkZW4gPSBbXTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFkYXRhLnRleHQpIHtcbiAgICAgICAgZGF0YS50ZXh0ID0gJyc7XG4gICAgICB9XG5cbiAgICAgIGlmIChkYXRhLm9ic29sZXRlcykge1xuICAgICAgICAvLyBnZXQga2V5d29yZHMgZnJvbSBlbW9qaSB0aGF0IGl0IG9ic29sZXRlcyBzaW5jZSB0aGF0IGlzIHNoYXJlZFxuICAgICAgICBjb25zdCBmID0gbGlzdC5maW5kKHggPT4geC51bmlmaWVkID09PSBkYXRhLm9ic29sZXRlcyk7XG4gICAgICAgIGlmIChmKSB7XG4gICAgICAgICAgaWYgKGYua2V5d29yZHMpIHtcbiAgICAgICAgICAgIGRhdGEua2V5d29yZHMgPSBbLi4uZGF0YS5rZXl3b3JkcywgLi4uZi5rZXl3b3JkcywgZi5zaG9ydE5hbWVdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkYXRhLmtleXdvcmRzID0gWy4uLmRhdGEua2V5d29yZHMsIGYuc2hvcnROYW1lXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5uYW1lc1tkYXRhLnVuaWZpZWRdID0gZGF0YTtcbiAgICAgIGZvciAoY29uc3QgbiBvZiBkYXRhLnNob3J0TmFtZXMpIHtcbiAgICAgICAgdGhpcy5uYW1lc1tuXSA9IGRhdGE7XG4gICAgICB9XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldERhdGEoXG4gICAgZW1vamk6IEVtb2ppRGF0YSB8IHN0cmluZyxcbiAgICBza2luPzogRW1vamlbJ3NraW4nXSxcbiAgICBzZXQ/OiBFbW9qaVsnc2V0J10sXG4gICk6IEVtb2ppRGF0YSB8IG51bGwge1xuICAgIGxldCBlbW9qaURhdGE6IGFueTtcblxuICAgIGlmICh0eXBlb2YgZW1vamkgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb25zdCBtYXRjaGVzID0gZW1vamkubWF0Y2goQ09MT05TX1JFR0VYKTtcblxuICAgICAgaWYgKG1hdGNoZXMpIHtcbiAgICAgICAgZW1vamkgPSBtYXRjaGVzWzFdO1xuXG4gICAgICAgIGlmIChtYXRjaGVzWzJdKSB7XG4gICAgICAgICAgc2tpbiA9IHBhcnNlSW50KG1hdGNoZXNbMl0sIDEwKSBhcyBFbW9qaVsnc2tpbiddO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5uYW1lcy5oYXNPd25Qcm9wZXJ0eShlbW9qaSkpIHtcbiAgICAgICAgZW1vamlEYXRhID0gdGhpcy5uYW1lc1tlbW9qaV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGVtb2ppLmlkKSB7XG4gICAgICBlbW9qaURhdGEgPSB0aGlzLm5hbWVzW2Vtb2ppLmlkXTtcbiAgICB9IGVsc2UgaWYgKGVtb2ppLnVuaWZpZWQpIHtcbiAgICAgIGVtb2ppRGF0YSA9IHRoaXMubmFtZXNbZW1vamkudW5pZmllZC50b1VwcGVyQ2FzZSgpXTtcbiAgICB9XG5cbiAgICBpZiAoIWVtb2ppRGF0YSkge1xuICAgICAgZW1vamlEYXRhID0gZW1vamk7XG4gICAgICBlbW9qaURhdGEuY3VzdG9tID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBoYXNTa2luVmFyaWF0aW9ucyA9IGVtb2ppRGF0YS5za2luVmFyaWF0aW9ucyAmJiBlbW9qaURhdGEuc2tpblZhcmlhdGlvbnMubGVuZ3RoO1xuICAgIGlmIChoYXNTa2luVmFyaWF0aW9ucyAmJiBza2luICYmIHNraW4gPiAxICYmIHNldCkge1xuICAgICAgZW1vamlEYXRhID0geyAuLi5lbW9qaURhdGEgfTtcblxuICAgICAgY29uc3Qgc2tpbktleSA9IFNLSU5TW3NraW4gLSAxXTtcbiAgICAgIGNvbnN0IHZhcmlhdGlvbkRhdGEgPSBlbW9qaURhdGEuc2tpblZhcmlhdGlvbnMuZmluZCgobjogRW1vamlWYXJpYXRpb24pID0+XG4gICAgICAgIG4udW5pZmllZC5pbmNsdWRlcyhza2luS2V5KSxcbiAgICAgICk7XG5cbiAgICAgIGlmICghdmFyaWF0aW9uRGF0YS5oaWRkZW4gfHwgIXZhcmlhdGlvbkRhdGEuaGlkZGVuLmluY2x1ZGVzKHNldCkpIHtcbiAgICAgICAgZW1vamlEYXRhLnNraW5Ub25lID0gc2tpbjtcbiAgICAgICAgZW1vamlEYXRhID0geyAuLi5lbW9qaURhdGEsIC4uLnZhcmlhdGlvbkRhdGEgfTtcbiAgICAgIH1cbiAgICAgIGVtb2ppRGF0YS5uYXRpdmUgPSB0aGlzLnVuaWZpZWRUb05hdGl2ZShlbW9qaURhdGEudW5pZmllZCk7XG4gICAgfVxuXG4gICAgZW1vamlEYXRhLnNldCA9IHNldCB8fCAnJztcbiAgICByZXR1cm4gZW1vamlEYXRhIGFzIEVtb2ppRGF0YTtcbiAgfVxuXG4gIHVuaWZpZWRUb05hdGl2ZSh1bmlmaWVkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBjb2RlUG9pbnRzID0gdW5pZmllZC5zcGxpdCgnLScpLm1hcCh1ID0+IHBhcnNlSW50KGAweCR7dX1gLCAxNikpO1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNvZGVQb2ludCguLi5jb2RlUG9pbnRzKTtcbiAgfVxuXG4gIGVtb2ppU3ByaXRlU3R5bGVzKFxuICAgIHNoZWV0OiBFbW9qaURhdGFbJ3NoZWV0J10sXG4gICAgc2V0OiBFbW9qaVsnc2V0J10gPSAnYXBwbGUnLFxuICAgIHNpemU6IEVtb2ppWydzaXplJ10gPSAyNCxcbiAgICBzaGVldFNpemU6IEVtb2ppWydzaGVldFNpemUnXSA9IDY0LFxuICAgIHNoZWV0Um93czogRW1vamlbJ3NoZWV0Um93cyddID0gNTcsXG4gICAgYmFja2dyb3VuZEltYWdlRm46IEVtb2ppWydiYWNrZ3JvdW5kSW1hZ2VGbiddID0gREVGQVVMVF9CQUNLR1JPVU5ERk4sXG4gICAgc2hlZXRDb2x1bW5zID0gNTcsXG4gICkge1xuICAgIHJldHVybiB7XG4gICAgICB3aWR0aDogYCR7c2l6ZX1weGAsXG4gICAgICBoZWlnaHQ6IGAke3NpemV9cHhgLFxuICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICAnYmFja2dyb3VuZC1pbWFnZSc6IGB1cmwoJHtiYWNrZ3JvdW5kSW1hZ2VGbihzZXQsIHNoZWV0U2l6ZSl9KWAsXG4gICAgICAnYmFja2dyb3VuZC1zaXplJzogYCR7MTAwICogc2hlZXRDb2x1bW5zfSUgJHsxMDAgKiBzaGVldFJvd3N9JWAsXG4gICAgICAnYmFja2dyb3VuZC1wb3NpdGlvbic6IHRoaXMuZ2V0U3ByaXRlUG9zaXRpb24oc2hlZXQsIHNoZWV0Q29sdW1ucyksXG4gICAgfTtcbiAgfVxuXG4gIGdldFNwcml0ZVBvc2l0aW9uKHNoZWV0OiBFbW9qaURhdGFbJ3NoZWV0J10sIHNoZWV0Q29sdW1uczogbnVtYmVyKSB7XG4gICAgY29uc3QgW3NoZWV0WCwgc2hlZXRZXSA9IHNoZWV0O1xuICAgIGNvbnN0IG11bHRpcGx5ID0gMTAwIC8gKHNoZWV0Q29sdW1ucyAtIDEpO1xuICAgIHJldHVybiBgJHttdWx0aXBseSAqIHNoZWV0WH0lICR7bXVsdGlwbHkgKiBzaGVldFl9JWA7XG4gIH1cblxuICBzYW5pdGl6ZShlbW9qaTogRW1vamlEYXRhIHwgbnVsbCk6IEVtb2ppRGF0YSB8IG51bGwge1xuICAgIGlmIChlbW9qaSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IGlkID0gZW1vamkuaWQgfHwgZW1vamkuc2hvcnROYW1lc1swXTtcbiAgICBsZXQgY29sb25zID0gYDoke2lkfTpgO1xuICAgIGlmIChlbW9qaS5za2luVG9uZSkge1xuICAgICAgY29sb25zICs9IGA6c2tpbi10b25lLSR7ZW1vamkuc2tpblRvbmV9OmA7XG4gICAgfVxuICAgIGVtb2ppLmNvbG9ucyA9IGNvbG9ucztcbiAgICByZXR1cm4geyAuLi5lbW9qaSB9O1xuICB9XG5cbiAgZ2V0U2FuaXRpemVkRGF0YShcbiAgICBlbW9qaTogc3RyaW5nIHwgRW1vamlEYXRhLFxuICAgIHNraW4/OiBFbW9qaVsnc2tpbiddLFxuICAgIHNldD86IEVtb2ppWydzZXQnXSxcbiAgKSB7XG4gICAgcmV0dXJuIHRoaXMuc2FuaXRpemUodGhpcy5nZXREYXRhKGVtb2ppLCBza2luLCBzZXQpKTtcbiAgfVxufVxuIl19
