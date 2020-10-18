(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? factory(
        exports,
        require("@angular/core"),
        require("@shared/lib/ngx-emoji-mart/ngx-emoji"),
        require("@angular/common"),
        require("@angular/forms")
      )
    : typeof define === "function" && define.amd
    ? define("@shared/lib/ngx-emoji-mart", [
        "exports",
        "@angular/core",
        "@shared/lib/ngx-emoji-mart/ngx-emoji",
        "@angular/common",
        "@angular/forms",
      ], factory)
    : ((global = global || self),
      factory(
        ((global.ctrl = global.ctrl || {}),
        (global.ctrl["ngx-emoji-mart"] = {})),
        global.ng.core,
        global.ctrl["ngx-emoji-mart"]["ngx-emoji"],
        global.ng.common,
        global.ng.forms
      ));
})(this, function (exports, i0, i1, common, forms) {
  "use strict";

  var AnchorsComponent = /** @class */ (function () {
    function AnchorsComponent() {
      this.categories = [];
      this.icons = {};
      this.anchorClick = new i0.EventEmitter();
    }
    AnchorsComponent.prototype.trackByFn = function (idx, cat) {
      return cat.id;
    };
    AnchorsComponent.prototype.handleClick = function ($event, index) {
      this.anchorClick.emit({
        category: this.categories[index],
        index: index,
      });
    };
    return AnchorsComponent;
  })();
  AnchorsComponent.decorators = [
    {
      type: i0.Component,
      args: [
        {
          selector: "emoji-mart-anchors",
          template:
            '\n  <div class="emoji-mart-anchors">\n    <ng-template ngFor let-category [ngForOf]="categories" let-idx="index" [ngForTrackBy]="trackByFn">\n      <span\n        *ngIf="category.anchor !== false"\n        [attr.title]="i18n.categories[category.id]"\n        (click)="this.handleClick($event, idx)"\n        class="emoji-mart-anchor"\n        [class.emoji-mart-anchor-selected]="category.name === selected"\n        [style.color]="category.name === selected ? color : null"\n      >\n        <div>\n          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">\n            <path [attr.d]="icons[category.id]" />\n          </svg>\n        </div>\n        <span class="emoji-mart-anchor-bar" [style.background-color]="color"></span>\n      </span>\n    </ng-template>\n  </div>\n  ',
          changeDetection: i0.ChangeDetectionStrategy.OnPush,
          preserveWhitespaces: false,
        },
      ],
    },
  ];
  AnchorsComponent.propDecorators = {
    categories: [{ type: i0.Input }],
    color: [{ type: i0.Input }],
    selected: [{ type: i0.Input }],
    i18n: [{ type: i0.Input }],
    icons: [{ type: i0.Input }],
    anchorClick: [{ type: i0.Output }],
  };

  var EmojiFrequentlyService = /** @class */ (function () {
    function EmojiFrequentlyService() {
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
    EmojiFrequentlyService.prototype.init = function () {
      this.frequently = JSON.parse(
        localStorage.getItem(this.NAMESPACE + ".frequently") || "null"
      );
      this.initialized = true;
    };
    EmojiFrequentlyService.prototype.add = function (emoji) {
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
      localStorage.setItem(this.NAMESPACE + ".last", emoji.id);
      localStorage.setItem(
        this.NAMESPACE + ".frequently",
        JSON.stringify(this.frequently)
      );
    };
    EmojiFrequentlyService.prototype.get = function (perLine, totalLines) {
      var _this = this;
      if (!this.initialized) {
        this.init();
      }
      if (this.frequently === null) {
        this.defaults = {};
        var result = [];
        for (var i = 0; i < perLine; i++) {
          this.defaults[this.DEFAULTS[i]] = perLine - i;
          result.push(this.DEFAULTS[i]);
        }
        return result;
      }
      var quantity = perLine * totalLines;
      var frequentlyKeys = Object.keys(this.frequently);
      var sorted = frequentlyKeys
        .sort(function (a, b) {
          return _this.frequently[a] - _this.frequently[b];
        })
        .reverse();
      var sliced = sorted.slice(0, quantity);
      var last = localStorage.getItem(this.NAMESPACE + ".last");
      if (last && !sliced.includes(last)) {
        sliced.pop();
        sliced.push(last);
      }
      return sliced;
    };
    return EmojiFrequentlyService;
  })();
  EmojiFrequentlyService.ɵprov = i0.ɵɵdefineInjectable({
    factory: function EmojiFrequentlyService_Factory() {
      return new EmojiFrequentlyService();
    },
    token: EmojiFrequentlyService,
    providedIn: "root",
  });
  EmojiFrequentlyService.decorators = [
    { type: i0.Injectable, args: [{ providedIn: "root" }] },
  ];

  var CategoryComponent = /** @class */ (function () {
    function CategoryComponent(ref, emojiService, frequently) {
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
      this.emojiOver = new i0.EventEmitter();
      this.emojiLeave = new i0.EventEmitter();
      this.emojiClick = new i0.EventEmitter();
      this.containerStyles = {};
      this.labelStyles = {};
      this.labelSpanStyles = {};
      this.margin = 0;
      this.minMargin = 0;
      this.maxMargin = 0;
      this.top = 0;
    }
    CategoryComponent.prototype.ngOnInit = function () {
      this.emojis = this.getEmojis();
      if (!this.emojis) {
        this.containerStyles = { display: "none" };
      }
      if (!this.hasStickyPosition) {
        this.labelStyles = { height: 28 };
        // this.labelSpanStyles = { position: 'absolute' };
      }
    };
    CategoryComponent.prototype.memoizeSize = function () {
      var parent = this.container.nativeElement.parentNode.parentNode;
      var _a = this.container.nativeElement.getBoundingClientRect(),
        top = _a.top,
        height = _a.height;
      var parentTop = parent.getBoundingClientRect().top;
      var labelHeight = this.label.nativeElement.getBoundingClientRect().height;
      this.top = top - parentTop + parent.scrollTop;
      if (height === 0) {
        this.maxMargin = 0;
      } else {
        this.maxMargin = height - labelHeight;
      }
    };
    CategoryComponent.prototype.handleScroll = function (scrollTop) {
      var margin = scrollTop - this.top;
      margin = margin < this.minMargin ? this.minMargin : margin;
      margin = margin > this.maxMargin ? this.maxMargin : margin;
      if (margin === this.margin) {
        return false;
      }
      if (!this.hasStickyPosition) {
        this.label.nativeElement.style.top = margin + "px";
      }
      this.margin = margin;
      return true;
    };
    CategoryComponent.prototype.getEmojis = function () {
      var _this = this;
      if (this.name === "Recent") {
        var frequentlyUsed =
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
            .map(function (id) {
              var emoji = _this.custom.filter(function (e) {
                return e.id === id;
              })[0];
              if (emoji) {
                return emoji;
              }
              return id;
            })
            .filter(function (id) {
              return !!_this.emojiService.getData(id);
            });
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
    };
    CategoryComponent.prototype.updateDisplay = function (display) {
      this.containerStyles.display = display;
      this.getEmojis();
      this.ref.detectChanges();
    };
    CategoryComponent.prototype.trackById = function (index, item) {
      return item;
    };
    return CategoryComponent;
  })();
  CategoryComponent.decorators = [
    {
      type: i0.Component,
      args: [
        {
          selector: "emoji-category",
          template:
            '\n  <section #container class="emoji-mart-category"\n    [attr.aria-label]="i18n.categories[id]"\n    [class.emoji-mart-no-results]="emojis && !emojis.length"\n    [ngStyle]="containerStyles">\n    <div class="emoji-mart-category-label"\n      [ngStyle]="labelStyles"\n      [attr.data-name]="name">\n      <!-- already labeled by the section aria-label -->\n      <span #label [ngStyle]="labelSpanStyles" aria-hidden="true">\n        {{ i18n.categories[id] }}\n      </span>\n    </div>\n\n    <ng-template [ngIf]="emojis">\n      <ngx-emoji\n        *ngFor="let emoji of emojis; trackBy: trackById"\n        [emoji]="emoji"\n        [size]="emojiSize"\n        [skin]="emojiSkin"\n        [isNative]="emojiIsNative"\n        [set]="emojiSet"\n        [sheetSize]="emojiSheetSize"\n        [forceSize]="emojiForceSize"\n        [tooltip]="emojiTooltip"\n        [backgroundImageFn]="emojiBackgroundImageFn"\n        [hideObsolete]="hideObsolete"\n        (emojiOver)="emojiOver.emit($event)"\n        (emojiLeave)="emojiLeave.emit($event)"\n        (emojiClick)="emojiClick.emit($event)"\n      ></ngx-emoji>\n    </ng-template>\n\n    <div *ngIf="emojis && !emojis.length">\n      <div>\n        <ngx-emoji\n          [emoji]="notFoundEmoji"\n          size="38"\n          [skin]="emojiSkin"\n          [isNative]="emojiIsNative"\n          [set]="emojiSet"\n          [sheetSize]="emojiSheetSize"\n          [forceSize]="emojiForceSize"\n          [tooltip]="emojiTooltip"\n          [backgroundImageFn]="emojiBackgroundImageFn"\n          [useButton]="emojiUseButton"\n        ></ngx-emoji>\n      </div>\n\n      <div class="emoji-mart-no-results-label">\n        {{ i18n.notfound }}\n      </div>\n    </div>\n\n  </section>\n  ',
          changeDetection: i0.ChangeDetectionStrategy.OnPush,
          preserveWhitespaces: false,
        },
      ],
    },
  ];
  CategoryComponent.ctorParameters = function () {
    return [
      { type: i0.ChangeDetectorRef },
      { type: i1.EmojiService },
      { type: EmojiFrequentlyService },
    ];
  };
  CategoryComponent.propDecorators = {
    emojis: [{ type: i0.Input }],
    hasStickyPosition: [{ type: i0.Input }],
    name: [{ type: i0.Input }],
    perLine: [{ type: i0.Input }],
    totalFrequentLines: [{ type: i0.Input }],
    recent: [{ type: i0.Input }],
    custom: [{ type: i0.Input }],
    i18n: [{ type: i0.Input }],
    id: [{ type: i0.Input }],
    hideObsolete: [{ type: i0.Input }],
    notFoundEmoji: [{ type: i0.Input }],
    emojiIsNative: [{ type: i0.Input }],
    emojiSkin: [{ type: i0.Input }],
    emojiSize: [{ type: i0.Input }],
    emojiSet: [{ type: i0.Input }],
    emojiSheetSize: [{ type: i0.Input }],
    emojiForceSize: [{ type: i0.Input }],
    emojiTooltip: [{ type: i0.Input }],
    emojiBackgroundImageFn: [{ type: i0.Input }],
    emojiUseButton: [{ type: i0.Input }],
    emojiOver: [{ type: i0.Output }],
    emojiLeave: [{ type: i0.Output }],
    emojiClick: [{ type: i0.Output }],
    container: [{ type: i0.ViewChild, args: ["container", { static: true }] }],
    label: [{ type: i0.ViewChild, args: ["label", { static: true }] }],
  };

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */
  /* global Reflect, Promise */
  var extendStatics = function (d, b) {
    extendStatics =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function (d, b) {
          d.__proto__ = b;
        }) ||
      function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };
    return extendStatics(d, b);
  };
  function __extends(d, b) {
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype =
      b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
  }
  var __assign = function () {
    __assign =
      Object.assign ||
      function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
  function __rest(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  }
  function __decorate(decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  }
  function __param(paramIndex, decorator) {
    return function (target, key) {
      decorator(target, key, paramIndex);
    };
  }
  function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(metadataKey, metadataValue);
  }
  function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }
  function __generator(thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  }
  var __createBinding = Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          },
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      };
  function __exportStar(m, exports) {
    for (var p in m)
      if (p !== "default" && !exports.hasOwnProperty(p))
        __createBinding(exports, m, p);
  }
  function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator,
      m = s && o[s],
      i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number")
      return {
        next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
        },
      };
    throw new TypeError(
      s ? "Object is not iterable." : "Symbol.iterator is not defined."
    );
  }
  function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
      r,
      ar = [],
      e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error: error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  }
  function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
      ar = ar.concat(__read(arguments[i]));
    return ar;
  }
  function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++)
      s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
        r[k] = a[j];
    return r;
  }
  function __await(v) {
    return this instanceof __await ? ((this.v = v), this) : new __await(v);
  }
  function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []),
      i,
      q = [];
    return (
      (i = {}),
      verb("next"),
      verb("throw"),
      verb("return"),
      (i[Symbol.asyncIterator] = function () {
        return this;
      }),
      i
    );
    function verb(n) {
      if (g[n])
        i[n] = function (v) {
          return new Promise(function (a, b) {
            q.push([n, v, a, b]) > 1 || resume(n, v);
          });
        };
    }
    function resume(n, v) {
      try {
        step(g[n](v));
      } catch (e) {
        settle(q[0][3], e);
      }
    }
    function step(r) {
      r.value instanceof __await
        ? Promise.resolve(r.value.v).then(fulfill, reject)
        : settle(q[0][2], r);
    }
    function fulfill(value) {
      resume("next", value);
    }
    function reject(value) {
      resume("throw", value);
    }
    function settle(f, v) {
      if ((f(v), q.shift(), q.length)) resume(q[0][0], q[0][1]);
    }
  }
  function __asyncDelegator(o) {
    var i, p;
    return (
      (i = {}),
      verb("next"),
      verb("throw", function (e) {
        throw e;
      }),
      verb("return"),
      (i[Symbol.iterator] = function () {
        return this;
      }),
      i
    );
    function verb(n, f) {
      i[n] = o[n]
        ? function (v) {
            return (p = !p)
              ? { value: __await(o[n](v)), done: n === "return" }
              : f
              ? f(v)
              : v;
          }
        : f;
    }
  }
  function __asyncValues(o) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator],
      i;
    return m
      ? m.call(o)
      : ((o =
          typeof __values === "function" ? __values(o) : o[Symbol.iterator]()),
        (i = {}),
        verb("next"),
        verb("throw"),
        verb("return"),
        (i[Symbol.asyncIterator] = function () {
          return this;
        }),
        i);
    function verb(n) {
      i[n] =
        o[n] &&
        function (v) {
          return new Promise(function (resolve, reject) {
            (v = o[n](v)), settle(resolve, reject, v.done, v.value);
          });
        };
    }
    function settle(resolve, reject, d, v) {
      Promise.resolve(v).then(function (v) {
        resolve({ value: v, done: d });
      }, reject);
    }
  }
  function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) {
      Object.defineProperty(cooked, "raw", { value: raw });
    } else {
      cooked.raw = raw;
    }
    return cooked;
  }
  var __setModuleDefault = Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      };
  function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  }
  function __importDefault(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  }
  function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
      throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
  }
  function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
      throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
  }

  function uniq(arr) {
    return arr.reduce(function (acc, item) {
      if (!acc.includes(item)) {
        acc.push(item);
      }
      return acc;
    }, []);
  }
  function intersect(a, b) {
    var uniqA = uniq(a);
    var uniqB = uniq(b);
    return uniqA.filter(function (item) {
      return uniqB.indexOf(item) >= 0;
    });
  }
  // https://github.com/sonicdoe/measure-scrollbar
  function measureScrollbar() {
    if (typeof document === "undefined") {
      return 0;
    }
    var div = document.createElement("div");
    div.style.width = "100px";
    div.style.height = "100px";
    div.style.overflow = "scroll";
    div.style.position = "absolute";
    div.style.top = "-9999px";
    document.body.appendChild(div);
    var scrollbarWidth = div.offsetWidth - div.clientWidth;
    document.body.removeChild(div);
    return scrollbarWidth;
  }

  var EmojiSearch = /** @class */ (function () {
    function EmojiSearch(emojiService) {
      var e_1, _b;
      var _this = this;
      this.emojiService = emojiService;
      this.originalPool = {};
      this.index = {};
      this.emojisList = {};
      this.emoticonsList = {};
      this.emojiSearch = {};
      var _loop_1 = function (emojiData) {
        var shortNames = emojiData.shortNames,
          emoticons = emojiData.emoticons;
        var id = shortNames[0];
        emoticons.forEach(function (emoticon) {
          if (_this.emoticonsList[emoticon]) {
            return;
          }
          _this.emoticonsList[emoticon] = id;
        });
        this_1.emojisList[id] = this_1.emojiService.getSanitizedData(id);
        this_1.originalPool[id] = emojiData;
      };
      var this_1 = this;
      try {
        for (
          var _c = __values(this.emojiService.emojis), _d = _c.next();
          !_d.done;
          _d = _c.next()
        ) {
          var emojiData = _d.value;
          _loop_1(emojiData);
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    }
    EmojiSearch.prototype.addCustomToPool = function (custom, pool) {
      var _this = this;
      custom.forEach(function (emoji) {
        var emojiId = emoji.id || emoji.shortNames[0];
        if (emojiId && !pool[emojiId]) {
          pool[emojiId] = _this.emojiService.getData(emoji);
          _this.emojisList[emojiId] = _this.emojiService.getSanitizedData(
            emoji
          );
        }
      });
    };
    EmojiSearch.prototype.search = function (
      value,
      emojisToShowFilter,
      maxResults,
      include,
      exclude,
      custom
    ) {
      var _this = this;
      if (maxResults === void 0) {
        maxResults = 75;
      }
      if (include === void 0) {
        include = [];
      }
      if (exclude === void 0) {
        exclude = [];
      }
      if (custom === void 0) {
        custom = [];
      }
      this.addCustomToPool(custom, this.originalPool);
      var results;
      var pool = this.originalPool;
      if (value.length) {
        if (value === "-" || value === "-1") {
          return [this.emojisList["-1"]];
        }
        if (value === "+" || value === "+1") {
          return [this.emojisList["+1"]];
        }
        var values = value.toLowerCase().split(/[\s|,|\-|_]+/);
        var allResults = [];
        if (values.length > 2) {
          values = [values[0], values[1]];
        }
        if (include.length || exclude.length) {
          pool = {};
          i1.categories.forEach(function (category) {
            var _a;
            var isIncluded =
              include && include.length
                ? include.indexOf(category.id) > -1
                : true;
            var isExcluded =
              exclude && exclude.length
                ? exclude.indexOf(category.id) > -1
                : false;
            if (!isIncluded || isExcluded) {
              return;
            }
            (_a = category.emojis) === null || _a === void 0
              ? void 0
              : _a.forEach(function (emojiId) {
                  var _a;
                  // Need to make sure that pool gets keyed
                  // with the correct id, which is why we call emojiService.getData below
                  var emoji = _this.emojiService.getData(emojiId);
                  pool[
                    (_a =
                      emoji === null || emoji === void 0
                        ? void 0
                        : emoji.id) !== null && _a !== void 0
                      ? _a
                      : ""
                  ] = emoji;
                });
          });
          if (custom.length) {
            var customIsIncluded =
              include && include.length ? include.indexOf("custom") > -1 : true;
            var customIsExcluded =
              exclude && exclude.length
                ? exclude.indexOf("custom") > -1
                : false;
            if (customIsIncluded && !customIsExcluded) {
              this.addCustomToPool(custom, pool);
            }
          }
        }
        allResults = values
          .map(function (v) {
            var aPool = pool;
            var aIndex = _this.index;
            var length = 0;
            var _loop_2 = function (charIndex) {
              var e_2, _b;
              var char = v[charIndex];
              length++;
              if (!aIndex[char]) {
                aIndex[char] = {};
              }
              aIndex = aIndex[char];
              if (!aIndex.results) {
                var scores_1 = {};
                aIndex.results = [];
                aIndex.pool = {};
                try {
                  for (
                    var _c = ((e_2 = void 0), __values(Object.keys(aPool))),
                      _d = _c.next();
                    !_d.done;
                    _d = _c.next()
                  ) {
                    var id = _d.value;
                    var emoji = aPool[id];
                    if (!_this.emojiSearch[id]) {
                      _this.emojiSearch[id] = _this.buildSearch(
                        emoji.short_names,
                        emoji.name,
                        emoji.id,
                        emoji.keywords,
                        emoji.emoticons
                      );
                    }
                    var query = _this.emojiSearch[id];
                    var sub = v.substr(0, length);
                    var subIndex = query.indexOf(sub);
                    if (subIndex !== -1) {
                      var score = subIndex + 1;
                      if (sub === id) {
                        score = 0;
                      }
                      aIndex.results.push(_this.emojisList[id]);
                      aIndex.pool[id] = emoji;
                      scores_1[id] = score;
                    }
                  }
                } catch (e_2_1) {
                  e_2 = { error: e_2_1 };
                } finally {
                  try {
                    if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                  } finally {
                    if (e_2) throw e_2.error;
                  }
                }
                aIndex.results.sort(function (a, b) {
                  var aScore = scores_1[a.id];
                  var bScore = scores_1[b.id];
                  return aScore - bScore;
                });
              }
              aPool = aIndex.pool;
            };
            // tslint:disable-next-line: prefer-for-of
            for (var charIndex = 0; charIndex < v.length; charIndex++) {
              _loop_2(charIndex);
            }
            return aIndex.results;
          })
          .filter(function (a) {
            return a;
          });
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
          results = results.filter(function (result) {
            if (result && result.id) {
              return emojisToShowFilter(_this.emojiService.names[result.id]);
            }
            return false;
          });
        }
        if (results && results.length > maxResults) {
          results = results.slice(0, maxResults);
        }
      }
      return results || null;
    };
    EmojiSearch.prototype.buildSearch = function (
      shortNames,
      name,
      id,
      keywords,
      emoticons
    ) {
      var search = [];
      var addToSearch = function (strings, split) {
        if (!strings) {
          return;
        }
        (Array.isArray(strings) ? strings : [strings]).forEach(function (str) {
          (split ? str.split(/[-|_|\s]+/) : [str]).forEach(function (s) {
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
    };
    return EmojiSearch;
  })();
  EmojiSearch.ɵprov = i0.ɵɵdefineInjectable({
    factory: function EmojiSearch_Factory() {
      return new EmojiSearch(i0.ɵɵinject(i1.EmojiService));
    },
    token: EmojiSearch,
    providedIn: "root",
  });
  EmojiSearch.decorators = [
    { type: i0.Injectable, args: [{ providedIn: "root" }] },
  ];
  EmojiSearch.ctorParameters = function () {
    return [{ type: i1.EmojiService }];
  };

  /* tslint:disable max-line-length */
  var categories = {
    activity:
      "M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24m10 11h-5c.3-2.5 1.3-4.8 2-6.1a10 10 0 0 1 3 6.1m-9 0V2a10 10 0 0 1 4.4 1.6A18 18 0 0 0 15 11h-2zm-2 0H9a18 18 0 0 0-2.4-7.4A10 10 0 0 1 11 2.1V11zm0 2v9a10 10 0 0 1-4.4-1.6A18 18 0 0 0 9 13h2zm4 0a18 18 0 0 0 2.4 7.4 10 10 0 0 1-4.4 1.5V13h2zM5 4.9c.7 1.3 1.7 3.6 2 6.1H2a10 10 0 0 1 3-6.1M2 13h5c-.3 2.5-1.3 4.8-2 6.1A10 10 0 0 1 2 13m17 6.1c-.7-1.3-1.7-3.6-2-6.1h5a10 10 0 0 1-3 6.1",
    custom:
      "M10 1h3v21h-3zm10.186 4l1.5 2.598L3.5 18.098 2 15.5zM2 7.598L3.5 5l18.186 10.5-1.5 2.598z",
    flags:
      "M0 0l6 24h2L2 0zm21 5h-4l-1-4H4l3 12h3l1 4h13L21 5zM6.6 3h7.8l2 8H8.6l-2-8zm8.8 10l-2.9 1.9-.4-1.9h3.3zm3.6 0l-1.5-6h2l2 8H16l3-2z",
    foods:
      "M17 5c-1.8 0-2.9.4-3.7 1 .5-1.3 1.8-3 4.7-3a1 1 0 0 0 0-2c-3 0-4.6 1.3-5.5 2.5l-.2.2c-.6-1.9-1.5-3.7-3-3.7C8.5 0 7.7.3 7 1c-2 1.5-1.7 2.9-.5 4C3.6 5.2 0 7.4 0 13c0 4.6 5 11 9 11 2 0 2.4-.5 3-1 .6.5 1 1 3 1 4 0 9-6.4 9-11 0-6-4-8-7-8M8.2 2.5c.7-.5 1-.5 1-.5.4.2 1 1.4 1.4 3-1.6-.6-2.8-1.3-3-1.8l.6-.7M15 22c-1 0-1.2-.1-1.6-.4l-.1-.2a2 2 0 0 0-2.6 0l-.1.2c-.4.3-.5.4-1.6.4-2.8 0-7-5.4-7-9 0-6 4.5-6 5-6 2 0 2.5.4 3.4 1.2l.3.3a2 2 0 0 0 2.6 0l.3-.3c1-.8 1.5-1.2 3.4-1.2.5 0 5 .1 5 6 0 3.6-4.2 9-7 9",
    nature:
      "M15.5 8a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m-7 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m10.43-8h-.02c-.97 0-2.14.79-3.02 1.5A13.88 13.88 0 0 0 12 .99c-1.28 0-2.62.13-3.87.51C7.24.8 6.07 0 5.09 0h-.02C3.35 0 .07 2.67 0 7.03c-.04 2.47.28 4.23 1.04 5 .26.27.88.69 1.3.9.19 3.17.92 5.23 2.53 6.37.9.64 2.19.95 3.2 1.1-.03.2-.07.4-.07.6 0 1.77 2.35 3 4 3s4-1.23 4-3c0-.2-.04-.4-.07-.59 2.57-.38 5.43-1.87 5.92-7.58.4-.22.89-.57 1.1-.8.77-.76 1.09-2.52 1.05-5C23.93 2.67 20.65 0 18.93 0M3.23 9.13c-.24.29-.84 1.16-.9 1.24A9.67 9.67 0 0 1 2 7.08c.05-3.28 2.48-4.97 3.1-5.03.25.02.72.27 1.26.65A7.95 7.95 0 0 0 4 7.82c-.14.55-.4.86-.79 1.31M12 22c-.9 0-1.95-.7-2-1 0-.65.47-1.24 1-1.6v.6a1 1 0 1 0 2 0v-.6c.52.36 1 .95 1 1.6-.05.3-1.1 1-2 1m3-3.48v.02a4.75 4.75 0 0 0-1.26-1.02c1.09-.52 2.24-1.33 2.24-2.22 0-1.84-1.78-2.2-3.98-2.2s-3.98.36-3.98 2.2c0 .89 1.15 1.7 2.24 2.22A4.8 4.8 0 0 0 9 18.54v-.03a6.1 6.1 0 0 1-2.97-.84c-1.3-.92-1.84-3.04-1.86-6.48l.03-.04c.5-.82 1.49-1.45 1.8-3.1C6 6 7.36 4.42 8.36 3.53c1.01-.35 2.2-.53 3.59-.53 1.45 0 2.68.2 3.73.57 1 .9 2.32 2.46 2.32 4.48.31 1.65 1.3 2.27 1.8 3.1l.1.18c-.06 5.97-1.95 7.01-4.9 7.19m6.63-8.2l-.11-.2a7.59 7.59 0 0 0-.74-.98 3.02 3.02 0 0 1-.79-1.32 7.93 7.93 0 0 0-2.35-5.12c.53-.38 1-.63 1.26-.65.64.07 3.05 1.77 3.1 5.03.02 1.81-.35 3.22-.37 3.24",
    objects:
      "M12 0a9 9 0 0 0-5 16.5V21s2 3 5 3 5-3 5-3v-4.5A9 9 0 0 0 12 0zm0 2a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM9 17.5a9 9 0 0 0 6 0v.8a7 7 0 0 1-3 .7 7 7 0 0 1-3-.7v-.8zm.2 3a8.9 8.9 0 0 0 2.8.5c1 0 1.9-.2 2.8-.5-.6.7-1.6 1.5-2.8 1.5-1.1 0-2.1-.8-2.8-1.5zm5.5-8.1c-.8 0-1.1-.8-1.5-1.8-.5-1-.7-1.5-1.2-1.5s-.8.5-1.3 1.5c-.4 1-.8 1.8-1.6 1.8h-.3c-.5-.2-.8-.7-1.3-1.8l-.2-1A3 3 0 0 0 7 9a1 1 0 0 1 0-2c1.7 0 2 1.4 2.2 2.1.5-1 1.3-2 2.8-2 1.5 0 2.3 1.1 2.7 2.1.2-.8.6-2.2 2.3-2.2a1 1 0 1 1 0 2c-.2 0-.3.5-.3.7a6.5 6.5 0 0 1-.3 1c-.5 1-.8 1.7-1.7 1.7",
    people:
      "M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24m0 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20M8 7a2 2 0 1 0 0 4 2 2 0 0 0 0-4m8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-.8 8c-.7 1.2-1.8 2-3.3 2-1.5 0-2.7-.8-3.4-2H15m3-2H6a6 6 0 1 0 12 0",
    places:
      "M6.5 12a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5m0 3c-.3 0-.5-.2-.5-.5s.2-.5.5-.5.5.2.5.5-.2.5-.5.5m11-3a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5m0 3c-.3 0-.5-.2-.5-.5s.2-.5.5-.5.5.2.5.5-.2.5-.5.5m5-5.5l-1-.4-.1-.1h.6c.6 0 1-.4 1-1 0-1-.9-2-2-2h-.6l-.8-1.7A3 3 0 0 0 16.8 2H7.2a3 3 0 0 0-2.8 2.3L3.6 6H3a2 2 0 0 0-2 2c0 .6.4 1 1 1h.6v.1l-1 .4a2 2 0 0 0-1.4 2l.7 7.6a1 1 0 0 0 1 .9H3v1c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-1h6v1c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-1h1.1a1 1 0 0 0 1-.9l.7-7.5a2 2 0 0 0-1.3-2.1M6.3 4.9c.1-.5.5-.9 1-.9h9.5c.4 0 .8.4 1 .9L19.2 9H4.7l1.6-4.1zM7 21H5v-1h2v1zm12 0h-2v-1h2v1zm2.2-3H2.8l-.7-6.6.9-.4h18l.9.4-.7 6.6z",
    recent:
      "M13 4h-2v7H9v2h2v2h2v-2h4v-2h-4zm-1-4a12 12 0 1 0 0 24 12 12 0 0 0 0-24m0 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20",
    symbols:
      "M0 0h11v2H0zm4 11h3V6h4V4H0v2h4zm11.5 6a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5m0-2.99a.5.5 0 0 1 0 .99c-.28 0-.5-.22-.5-.5s.22-.49.5-.49m6 5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5m0 2.99a.5.5 0 0 1-.5-.5.5.5 0 0 1 1 .01.5.5 0 0 1-.5.49m.5-9l-9 9 1.51 1.5 9-9zm-5-2c2.2 0 4-1.12 4-2.5V2s.98-.16 1.5.95C23 4.05 23 6 23 6s1-1.12 1-3.13C24-.02 21 0 21 0h-2v6.35A5.85 5.85 0 0 0 17 6c-2.2 0-4 1.12-4 2.5s1.8 2.5 4 2.5m-6.7 9.48L8.82 18.9a47.54 47.54 0 0 1-1.44 1.13c-.3-.3-.99-1.02-2.04-2.19.9-.83 1.47-1.46 1.72-1.89s.38-.87.38-1.33c0-.6-.27-1.18-.82-1.76-.54-.58-1.33-.87-2.35-.87-1 0-1.79.29-2.34.87-.56.6-.83 1.18-.83 1.79 0 .81.42 1.75 1.25 2.8a6.57 6.57 0 0 0-1.8 1.79 3.46 3.46 0 0 0-.51 1.83c0 .86.3 1.56.92 2.1a3.5 3.5 0 0 0 2.42.83c1.17 0 2.44-.38 3.81-1.14L8.23 24h2.82l-2.09-2.38 1.34-1.14zM3.56 14.1a1.02 1.02 0 0 1 .73-.28c.31 0 .56.08.75.25a.85.85 0 0 1 .28.66c0 .52-.42 1.11-1.26 1.78-.53-.65-.8-1.23-.8-1.74a.9.9 0 0 1 .3-.67m.18 7.9c-.43 0-.78-.12-1.06-.35-.28-.23-.41-.49-.41-.76 0-.6.5-1.3 1.52-2.09a31.23 31.23 0 0 0 2.25 2.44c-.92.5-1.69.76-2.3.76",
  };
  var search = {
    search:
      "M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z",
    delete:
      "M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z",
  };

  var I18N = {
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
  var PickerComponent = /** @class */ (function () {
    function PickerComponent(ref, frequently) {
      var _this = this;
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
      this.emojiClick = new i0.EventEmitter();
      this.emojiSelect = new i0.EventEmitter();
      this.skinChange = new i0.EventEmitter();
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
      this.backgroundImageFn = function (set, sheetSize) {
        return "/assets/emoji/64.png";
      };
    }
    PickerComponent.prototype.ngOnInit = function () {
      var e_1, _a;
      var _this = this;
      // measure scroll
      this.measureScrollbar = measureScrollbar();
      this.i18n = Object.assign(Object.assign({}, I18N), this.i18n);
      this.i18n.categories = Object.assign(
        Object.assign({}, I18N.categories),
        this.i18n.categories
      );
      this.skin =
        JSON.parse(localStorage.getItem(this.NAMESPACE + ".skin") || "null") ||
        this.skin;
      var allCategories = __spread(i1.categories);
      if (this.custom.length > 0) {
        this.CUSTOM_CATEGORY.emojis = this.custom.map(function (emoji) {
          return Object.assign(Object.assign({}, emoji), {
            // `<Category />` expects emoji to have an `id`.
            id: emoji.shortNames[0],
            custom: true,
          });
        });
        allCategories.push(this.CUSTOM_CATEGORY);
      }
      if (this.include !== undefined) {
        allCategories.sort(function (a, b) {
          if (_this.include.indexOf(a.id) > _this.include.indexOf(b.id)) {
            return 1;
          }
          return -1;
        });
      }
      try {
        for (
          var allCategories_1 = __values(allCategories),
            allCategories_1_1 = allCategories_1.next();
          !allCategories_1_1.done;
          allCategories_1_1 = allCategories_1.next()
        ) {
          var category = allCategories_1_1.value;
          var isIncluded =
            this.include && this.include.length
              ? this.include.indexOf(category.id) > -1
              : true;
          var isExcluded =
            this.exclude && this.exclude.length
              ? this.exclude.indexOf(category.id) > -1
              : false;
          if (!isIncluded || isExcluded) {
            continue;
          }
          if (this.emojisToShowFilter) {
            var newEmojis = [];
            var emojis = category.emojis;
            // tslint:disable-next-line: prefer-for-of
            for (var emojiIndex = 0; emojiIndex < emojis.length; emojiIndex++) {
              var emoji = emojis[emojiIndex];
              if (this.emojisToShowFilter(emoji)) {
                newEmojis.push(emoji);
              }
            }
            if (newEmojis.length) {
              var newCategory = {
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
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (
            allCategories_1_1 &&
            !allCategories_1_1.done &&
            (_a = allCategories_1.return)
          )
            _a.call(allCategories_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
      var includeRecent =
        this.include && this.include.length
          ? this.include.indexOf(this.RECENT_CATEGORY.id) > -1
          : true;
      var excludeRecent =
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
      this.selected = this.categories.filter(function (category) {
        return category.first;
      })[0].name;
      // Need to be careful if small number of categories
      var categoriesToLoadFirst = Math.min(this.categories.length, 3);
      this.setActiveCategories(
        (this.activeCategories = this.categories.slice(
          0,
          categoriesToLoadFirst
        ))
      );
      // Trim last active category
      var lastActiveCategoryEmojis = this.categories[
        categoriesToLoadFirst - 1
      ].emojis.slice();
      this.categories[
        categoriesToLoadFirst - 1
      ].emojis = lastActiveCategoryEmojis.slice(0, 60);
      this.ref.markForCheck();
      setTimeout(function () {
        // Restore last category
        _this.categories[
          categoriesToLoadFirst - 1
        ].emojis = lastActiveCategoryEmojis;
        _this.setActiveCategories(_this.categories);
        _this.ref.markForCheck();
        setTimeout(function () {
          return _this.updateCategoriesSize();
        });
      });
    };
    PickerComponent.prototype.setActiveCategories = function (
      categoriesToMakeActive
    ) {
      var _this = this;
      if (this.showSingleCategory) {
        this.activeCategories = categoriesToMakeActive.filter(function (x) {
          return x.name === _this.selected || x === _this.SEARCH_CATEGORY;
        });
      } else {
        this.activeCategories = categoriesToMakeActive;
      }
    };
    PickerComponent.prototype.updateCategoriesSize = function () {
      this.categoryRefs.forEach(function (component) {
        return component.memoizeSize();
      });
      if (this.scrollRef) {
        var target = this.scrollRef.nativeElement;
        this.scrollHeight = target.scrollHeight;
        this.clientHeight = target.clientHeight;
      }
    };
    PickerComponent.prototype.handleAnchorClick = function ($event) {
      this.updateCategoriesSize();
      this.selected = $event.category.name;
      this.setActiveCategories(this.categories);
      if (this.SEARCH_CATEGORY.emojis) {
        this.handleSearch(null);
        this.searchRef.clear();
        this.handleAnchorClick($event);
        return;
      }
      var component = this.categoryRefs.find(function (n) {
        return n.id === $event.category.id;
      });
      if (component) {
        var top = component.top;
        if ($event.category.first) {
          top = 0;
        } else {
          top += 1;
        }
        this.scrollRef.nativeElement.scrollTop = top;
      }
      this.selected = $event.category.name;
      this.nextScroll = $event.category.name;
    };
    PickerComponent.prototype.categoryTrack = function (index, item) {
      return item.id;
    };
    PickerComponent.prototype.handleScroll = function () {
      var e_2, _a;
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
      var activeCategory = null;
      if (this.SEARCH_CATEGORY.emojis) {
        activeCategory = this.SEARCH_CATEGORY;
      } else {
        var target = this.scrollRef.nativeElement;
        // check scroll is not at bottom
        if (target.scrollTop === 0) {
          // hit the TOP
          activeCategory = this.categories.find(function (n) {
            return n.first === true;
          });
        } else if (
          target.scrollHeight - target.scrollTop ===
          this.clientHeight
        ) {
          // scrolled to bottom activate last category
          activeCategory = this.categories[this.categories.length - 1];
        } else {
          var _loop_1 = function (category) {
            var component = this_1.categoryRefs.find(function (n) {
              return n.id === category.id;
            });
            var active = component.handleScroll(target.scrollTop);
            if (active) {
              activeCategory = category;
            }
          };
          var this_1 = this;
          try {
            // scrolling
            for (
              var _b = __values(this.categories), _c = _b.next();
              !_c.done;
              _c = _b.next()
            ) {
              var category = _c.value;
              _loop_1(category);
            }
          } catch (e_2_1) {
            e_2 = { error: e_2_1 };
          } finally {
            try {
              if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            } finally {
              if (e_2) throw e_2.error;
            }
          }
        }
        this.scrollTop = target.scrollTop;
      }
      if (activeCategory) {
        this.selected = activeCategory.name;
      }
    };
    PickerComponent.prototype.handleSearch = function ($emojis) {
      var e_3, _a;
      this.SEARCH_CATEGORY.emojis = $emojis;
      try {
        for (
          var _b = __values(this.categoryRefs.toArray()), _c = _b.next();
          !_c.done;
          _c = _b.next()
        ) {
          var component = _c.value;
          if (component.name === "Search") {
            component.emojis = $emojis;
            component.updateDisplay($emojis ? "block" : "none");
          } else {
            component.updateDisplay($emojis ? "none" : "block");
          }
        }
      } catch (e_3_1) {
        e_3 = { error: e_3_1 };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_3) throw e_3.error;
        }
      }
      this.scrollRef.nativeElement.scrollTop = 0;
      this.handleScroll();
    };
    PickerComponent.prototype.handleEnterKey = function ($event, emoji) {
      if (!emoji) {
        if (
          this.SEARCH_CATEGORY.emojis !== null &&
          this.SEARCH_CATEGORY.emojis.length
        ) {
          emoji = this.SEARCH_CATEGORY.emojis[0];
          if (emoji) {
            this.emojiSelect.emit({ $event: $event, emoji: emoji });
          } else {
            return;
          }
        }
      }
      if (!this.hideRecent && !this.recent && emoji) {
        this.frequently.add(emoji);
      }
      var component = this.categoryRefs.toArray()[1];
      if (component && this.enableFrequentEmojiSort) {
        component.getEmojis();
        component.ref.markForCheck();
      }
    };
    PickerComponent.prototype.handleEmojiOver = function ($event) {
      if (!this.showPreview || !this.previewRef) {
        return;
      }
      var emojiData = this.CUSTOM_CATEGORY.emojis.find(function (customEmoji) {
        return customEmoji.id === $event.emoji.id;
      });
      if (emojiData) {
        $event.emoji = Object.assign({}, emojiData);
      }
      this.previewEmoji = $event.emoji;
      clearTimeout(this.leaveTimeout);
    };
    PickerComponent.prototype.handleEmojiLeave = function () {
      var _this = this;
      if (!this.showPreview || !this.previewRef) {
        return;
      }
      this.leaveTimeout = setTimeout(function () {
        _this.previewEmoji = null;
        _this.previewRef.ref.markForCheck();
      }, 16);
    };
    PickerComponent.prototype.handleEmojiClick = function ($event) {
      this.emojiClick.emit($event);
      this.emojiSelect.emit($event);
      this.handleEnterKey($event.$event, $event.emoji);
    };
    PickerComponent.prototype.handleSkinChange = function (skin) {
      this.skin = skin;
      localStorage.setItem(this.NAMESPACE + ".skin", String(skin));
      this.skinChange.emit(skin);
    };
    PickerComponent.prototype.getWidth = function () {
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
    };
    return PickerComponent;
  })();
  PickerComponent.decorators = [
    {
      type: i0.Component,
      args: [
        {
          selector: "emoji-mart",
          template:
            '<section class="emoji-mart {{ darkMode ? \'emoji-mart-dark\' : \'\' }}"\n  [style.width]="getWidth()"\n  [ngStyle]="style">\n  <div class="emoji-mart-bar">\n    <emoji-mart-anchors\n      [categories]="categories"\n      (anchorClick)="handleAnchorClick($event)"\n      [color]="color"\n      [selected]="selected"\n      [i18n]="i18n"\n      [icons]="categoriesIcons"\n    ></emoji-mart-anchors>\n  </div>\n  <emoji-search\n    *ngIf="enableSearch"\n    #searchRef\n    [i18n]="i18n"\n    (searchResults)="handleSearch($event)"\n    (enterKey)="handleEnterKey($event)"\n    [include]="include"\n    [exclude]="exclude"\n    [custom]="custom"\n    [autoFocus]="autoFocus"\n    [icons]="searchIcons"\n    [emojisToShowFilter]="emojisToShowFilter"\n  ></emoji-search>\n  <section #scrollRef class="emoji-mart-scroll" (scroll)="handleScroll()" [attr.aria-label]="i18n.emojilist">\n    <emoji-category\n      *ngFor="let category of activeCategories; let idx = index; trackBy: categoryTrack"\n      #categoryRef\n      [id]="category.id"\n      [name]="category.name"\n      [emojis]="category.emojis"\n      [perLine]="perLine"\n      [totalFrequentLines]="totalFrequentLines"\n      [hasStickyPosition]="isNative"\n      [i18n]="i18n"\n      [hideObsolete]="hideObsolete"\n      [notFoundEmoji]="notFoundEmoji"\n      [custom]="category.id == RECENT_CATEGORY.id ? CUSTOM_CATEGORY.emojis : undefined"\n      [recent]="category.id == RECENT_CATEGORY.id ? recent : undefined"\n      [emojiIsNative]="isNative"\n      [emojiSkin]="skin"\n      [emojiSize]="emojiSize"\n      [emojiSet]="set"\n      [emojiSheetSize]="sheetSize"\n      [emojiForceSize]="isNative"\n      [emojiTooltip]="emojiTooltip"\n      [emojiBackgroundImageFn]="backgroundImageFn"\n      [emojiUseButton]="false"\n      (emojiOver)="handleEmojiOver($event)"\n      (emojiLeave)="handleEmojiLeave()"\n      (emojiClick)="handleEmojiClick($event)"\n    ></emoji-category>\n  </section>\n  <div class="emoji-mart-bar" *ngIf="showPreview">\n    <emoji-preview\n      #previewRef\n      [title]="title"\n      [emoji]="previewEmoji"\n      [idleEmoji]="emoji"\n      [emojiIsNative]="isNative"\n      [emojiSize]="38"\n      [emojiSkin]="skin"\n      [emojiSet]="set"\n      [i18n]="i18n"\n      [emojiSheetSize]="sheetSize"\n      [emojiBackgroundImageFn]="backgroundImageFn"\n      (skinChange)="handleSkinChange($event)"\n    ></emoji-preview>\n  </div>\n</section>\n',
          changeDetection: i0.ChangeDetectionStrategy.OnPush,
          preserveWhitespaces: false,
        },
      ],
    },
  ];
  PickerComponent.ctorParameters = function () {
    return [{ type: i0.ChangeDetectorRef }, { type: EmojiFrequentlyService }];
  };
  PickerComponent.propDecorators = {
    perLine: [{ type: i0.Input }],
    totalFrequentLines: [{ type: i0.Input }],
    i18n: [{ type: i0.Input }],
    style: [{ type: i0.Input }],
    title: [{ type: i0.Input }],
    emoji: [{ type: i0.Input }],
    darkMode: [{ type: i0.Input }],
    color: [{ type: i0.Input }],
    hideObsolete: [{ type: i0.Input }],
    categories: [{ type: i0.Input }],
    activeCategories: [{ type: i0.Input }],
    set: [{ type: i0.Input }],
    skin: [{ type: i0.Input }],
    isNative: [{ type: i0.Input }],
    emojiSize: [{ type: i0.Input }],
    sheetSize: [{ type: i0.Input }],
    emojisToShowFilter: [{ type: i0.Input }],
    showPreview: [{ type: i0.Input }],
    emojiTooltip: [{ type: i0.Input }],
    autoFocus: [{ type: i0.Input }],
    custom: [{ type: i0.Input }],
    hideRecent: [{ type: i0.Input }],
    include: [{ type: i0.Input }],
    exclude: [{ type: i0.Input }],
    notFoundEmoji: [{ type: i0.Input }],
    categoriesIcons: [{ type: i0.Input }],
    searchIcons: [{ type: i0.Input }],
    useButton: [{ type: i0.Input }],
    enableFrequentEmojiSort: [{ type: i0.Input }],
    enableSearch: [{ type: i0.Input }],
    showSingleCategory: [{ type: i0.Input }],
    emojiClick: [{ type: i0.Output }],
    emojiSelect: [{ type: i0.Output }],
    skinChange: [{ type: i0.Output }],
    scrollRef: [{ type: i0.ViewChild, args: ["scrollRef", { static: true }] }],
    previewRef: [{ type: i0.ViewChild, args: ["previewRef"] }],
    searchRef: [{ type: i0.ViewChild, args: ["searchRef", { static: true }] }],
    categoryRefs: [{ type: i0.ViewChildren, args: ["categoryRef"] }],
    backgroundImageFn: [{ type: i0.Input }],
  };

  var PreviewComponent = /** @class */ (function () {
    function PreviewComponent(ref, emojiService) {
      this.ref = ref;
      this.emojiService = emojiService;
      this.skinChange = new i0.EventEmitter();
      this.emojiData = {};
    }
    PreviewComponent.prototype.ngOnChanges = function () {
      if (!this.emoji) {
        return;
      }
      this.emojiData = this.emojiService.getData(
        this.emoji,
        this.emojiSkin,
        this.emojiSet
      );
      var knownEmoticons = [];
      var listedEmoticons = [];
      var emoitcons = this.emojiData.emoticons || [];
      emoitcons.forEach(function (emoticon) {
        if (knownEmoticons.indexOf(emoticon.toLowerCase()) >= 0) {
          return;
        }
        knownEmoticons.push(emoticon.toLowerCase());
        listedEmoticons.push(emoticon);
      });
      this.listedEmoticons = listedEmoticons;
    };
    return PreviewComponent;
  })();
  PreviewComponent.decorators = [
    {
      type: i0.Component,
      args: [
        {
          selector: "emoji-preview",
          template:
            '\n  <div class="emoji-mart-preview" *ngIf="emoji && emojiData">\n    <div class="emoji-mart-preview-emoji">\n      <ngx-emoji\n        [emoji]="emoji"\n        [size]="38"\n        [isNative]="emojiIsNative"\n        [skin]="emojiSkin"\n        [size]="emojiSize"\n        [set]="emojiSet"\n        [sheetSize]="emojiSheetSize"\n        [backgroundImageFn]="emojiBackgroundImageFn"\n      ></ngx-emoji>\n    </div>\n\n    <div class="emoji-mart-preview-data">\n      <div class="emoji-mart-preview-name">{{ emojiData.name }}</div>\n      <div class="emoji-mart-preview-shortname">\n        <span class="emoji-mart-preview-shortname" *ngFor="let short_name of emojiData.shortNames">\n          :{{ short_name }}:\n        </span>\n      </div>\n      <div class="emoji-mart-preview-emoticons">\n        <span class="emoji-mart-preview-emoticon" *ngFor="let emoticon of listedEmoticons">\n          {{ emoticon }}\n        </span>\n      </div>\n    </div>\n  </div>\n\n  <div class="emoji-mart-preview" *ngIf="!emoji">\n    <div class="emoji-mart-preview-emoji">\n      <ngx-emoji *ngIf="idleEmoji && idleEmoji.length"\n        [isNative]="emojiIsNative"\n        [skin]="emojiSkin"\n        [set]="emojiSet"\n        [emoji]="idleEmoji"\n        [backgroundImageFn]="emojiBackgroundImageFn"\n        [size]="38"\n      ></ngx-emoji>\n    </div>\n\n    <div class="emoji-mart-preview-data">\n      <span class="emoji-mart-title-label">{{ title }}</span>\n    </div>\n\n    <div class="emoji-mart-preview-skins">\n      <emoji-skins [skin]="emojiSkin" (changeSkin)="skinChange.emit($event)" [i18n]="i18n">\n      </emoji-skins>\n    </div>\n  </div>\n  ',
          changeDetection: i0.ChangeDetectionStrategy.OnPush,
          preserveWhitespaces: false,
        },
      ],
    },
  ];
  PreviewComponent.ctorParameters = function () {
    return [{ type: i0.ChangeDetectorRef }, { type: i1.EmojiService }];
  };
  PreviewComponent.propDecorators = {
    title: [{ type: i0.Input }],
    emoji: [{ type: i0.Input }],
    idleEmoji: [{ type: i0.Input }],
    i18n: [{ type: i0.Input }],
    emojiIsNative: [{ type: i0.Input }],
    emojiSkin: [{ type: i0.Input }],
    emojiSize: [{ type: i0.Input }],
    emojiSet: [{ type: i0.Input }],
    emojiSheetSize: [{ type: i0.Input }],
    emojiBackgroundImageFn: [{ type: i0.Input }],
    skinChange: [{ type: i0.Output }],
  };

  var id = 0;
  var SearchComponent = /** @class */ (function () {
    function SearchComponent(emojiSearch) {
      this.emojiSearch = emojiSearch;
      this.maxResults = 75;
      this.autoFocus = false;
      this.include = [];
      this.exclude = [];
      this.custom = [];
      this.searchResults = new i0.EventEmitter();
      this.enterKey = new i0.EventEmitter();
      this.isSearching = false;
      this.query = "";
      this.inputId = "emoji-mart-search-" + ++id;
    }
    SearchComponent.prototype.ngOnInit = function () {
      this.icon = this.icons.search;
    };
    SearchComponent.prototype.ngAfterViewInit = function () {
      if (this.autoFocus) {
        this.inputRef.nativeElement.focus();
      }
    };
    SearchComponent.prototype.clear = function () {
      this.query = "";
      this.handleSearch("");
      this.inputRef.nativeElement.focus();
    };
    SearchComponent.prototype.handleEnterKey = function ($event) {
      if (!this.query) {
        return;
      }
      this.enterKey.emit($event);
      $event.preventDefault();
    };
    SearchComponent.prototype.handleSearch = function (value) {
      if (value === "") {
        this.icon = this.icons.search;
        this.isSearching = false;
      } else {
        this.icon = this.icons.delete;
        this.isSearching = true;
      }
      var emojis = this.emojiSearch.search(
        this.query,
        this.emojisToShowFilter,
        this.maxResults,
        this.include,
        this.exclude,
        this.custom
      );
      this.searchResults.emit(emojis);
    };
    SearchComponent.prototype.handleChange = function () {
      this.handleSearch(this.query);
    };
    return SearchComponent;
  })();
  SearchComponent.decorators = [
    {
      type: i0.Component,
      args: [
        {
          selector: "emoji-search",
          template:
            '\n    <div class="emoji-mart-search">\n      <input\n        [id]="inputId"\n        #inputRef\n        type="search"\n        (keyup.enter)="handleEnterKey($event)"\n        [placeholder]="i18n.search"\n        [autofocus]="autoFocus"\n        [(ngModel)]="query"\n        (ngModelChange)="handleChange()"\n      />\n      <!--\n      Use a <label> in addition to the placeholder for accessibility, but place it off-screen\n      http://www.maxability.co.in/2016/01/placeholder-attribute-and-why-it-is-not-accessible/\n      -->\n      <label class="emoji-mart-sr-only" [htmlFor]="inputId">\n        {{ i18n.search }}\n      </label>\n      <button\n        type="button"\n        class="emoji-mart-search-icon"\n        (click)="clear()"\n        (keyup.enter)="clear()"\n        [disabled]="!isSearching"\n        [attr.aria-label]="i18n.clear"\n      >\n        <svg\n          xmlns="http://www.w3.org/2000/svg"\n          viewBox="0 0 20 20"\n          width="13"\n          height="13"\n          opacity="0.5"\n        >\n          <path [attr.d]="icon" />\n        </svg>\n      </button>\n    </div>\n  ',
          preserveWhitespaces: false,
        },
      ],
    },
  ];
  SearchComponent.ctorParameters = function () {
    return [{ type: EmojiSearch }];
  };
  SearchComponent.propDecorators = {
    maxResults: [{ type: i0.Input }],
    autoFocus: [{ type: i0.Input }],
    i18n: [{ type: i0.Input }],
    include: [{ type: i0.Input }],
    exclude: [{ type: i0.Input }],
    custom: [{ type: i0.Input }],
    icons: [{ type: i0.Input }],
    emojisToShowFilter: [{ type: i0.Input }],
    searchResults: [{ type: i0.Output }],
    enterKey: [{ type: i0.Output }],
    inputRef: [{ type: i0.ViewChild, args: ["inputRef", { static: true }] }],
  };

  var SkinComponent = /** @class */ (function () {
    function SkinComponent() {
      this.changeSkin = new i0.EventEmitter();
      this.opened = false;
      this.skinTones = [1, 2, 3, 4, 5, 6];
    }
    SkinComponent.prototype.toggleOpen = function () {
      this.opened = !this.opened;
    };
    SkinComponent.prototype.isSelected = function (skinTone) {
      return skinTone === this.skin;
    };
    SkinComponent.prototype.isVisible = function (skinTone) {
      return this.opened || this.isSelected(skinTone);
    };
    SkinComponent.prototype.pressed = function (skinTone) {
      return this.opened ? !!this.isSelected(skinTone) : "";
    };
    SkinComponent.prototype.tabIndex = function (skinTone) {
      return this.isVisible(skinTone) ? "0" : "";
    };
    SkinComponent.prototype.expanded = function (skinTone) {
      return this.isSelected(skinTone) ? this.opened : "";
    };
    SkinComponent.prototype.handleClick = function (skin) {
      if (!this.opened) {
        this.opened = true;
        return;
      }
      this.opened = false;
      if (skin !== this.skin) {
        this.changeSkin.emit(skin);
      }
    };
    return SkinComponent;
  })();
  SkinComponent.decorators = [
    {
      type: i0.Component,
      args: [
        {
          selector: "emoji-skins",
          template:
            '\n    <section\n      class="emoji-mart-skin-swatches"\n      [class.opened]="opened"\n    >\n      <span\n        *ngFor="let skinTone of skinTones"\n        class="emoji-mart-skin-swatch"\n        [class.selected]="skinTone === skin"\n      >\n        <span\n          (click)="this.handleClick(skinTone)"\n          (keyup.enter)="handleClick(skinTone)"\n          (keyup.space)="handleClick(skinTone)"\n          class="emoji-mart-skin emoji-mart-skin-tone-{{ skinTone }}"\n          role="button"\n          [tabIndex]="tabIndex(skinTone)"\n          [attr.aria-hidden]="!isVisible(skinTone)"\n          [attr.aria-pressed]="pressed(skinTone)"\n          [attr.aria-haspopup]="!!isSelected(skinTone)"\n          [attr.aria-expanded]="expanded(skinTone)"\n          [attr.aria-label]="i18n.skintones[skinTone]"\n          [title]="i18n.skintones[skinTone]"\n        ></span>\n      </span>\n    </section>\n  ',
          changeDetection: i0.ChangeDetectionStrategy.OnPush,
          preserveWhitespaces: false,
        },
      ],
    },
  ];
  SkinComponent.propDecorators = {
    skin: [{ type: i0.Input }],
    i18n: [{ type: i0.Input }],
    changeSkin: [{ type: i0.Output }],
  };

  var PickerModule = /** @class */ (function () {
    function PickerModule() {}
    return PickerModule;
  })();
  PickerModule.decorators = [
    {
      type: i0.NgModule,
      args: [
        {
          imports: [common.CommonModule, forms.FormsModule, i1.EmojiModule],
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

  exports.AnchorsComponent = AnchorsComponent;
  exports.CategoryComponent = CategoryComponent;
  exports.EmojiFrequentlyService = EmojiFrequentlyService;
  exports.EmojiSearch = EmojiSearch;
  exports.PickerComponent = PickerComponent;
  exports.PickerModule = PickerModule;
  exports.PreviewComponent = PreviewComponent;
  exports.SearchComponent = SearchComponent;
  exports.SkinComponent = SkinComponent;

  Object.defineProperty(exports, "__esModule", { value: true });
});
//# sourceMappingURL=ctrl-ngx-emoji-mart.umd.js.map
