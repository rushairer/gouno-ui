# Component localization — PD-074

Core owns generic component-operation copy. Products own field names, business titles, messages, option content and application language selection. English defaults are valid library behavior; hardcoded mixed languages that cannot be overridden are not.

## Public entry and precedence

`ConfigProvider`, `ConfigProviderProps`, `ComponentLocale`, `enUS`, `zhCN`, and the six component locale interfaces are exported from `@gouno/ui/core`. The package root remains a compatibility umbrella. ConfigProvider adds no DOM and has no Theme dependency, storage, browser-language detection, routing or application state.

| ConfigProvider prop | Type | Default | Behavior |
| --- | --- | --- | --- |
| locale | ComponentLocale | nearest provider, then enUS | Complete language pack; a nested explicit pack replaces the parent pack. |
| children | ReactNode | absent | React subtree, including its portals. |

`ComponentLocale.locale` is a string identifier. Its six component sections are required. Missing runtime keys defensively fall back to English; TypeScript requires complete packs. The provider does not change HTML `lang`/`dir`, native date/number formatting or browser-owned picker UI.

Each participating component accepts `locale?: Partial<XLocale>`. Defined local entries override provider copy; `undefined` inherits. Existing explicit `placeholder`, `prevText`, `nextText` and `ariaLabel` props retain authority and are deliberately excluded from that component's local locale type. Empty strings are explicit values; applications must not provide empty accessible names.

| Priority | Source |
| --- | --- |
| 1 | Existing explicit component text props or component-local locale entries (disjoint keys) |
| 2 | Nearest complete provider language pack |
| 3 | English library defaults |

## Language fields

All fields below are strings except the explicitly typed formatters. Local interfaces contain the listed fields unless marked provider-only.

| Section / local type | Fields | enUS defaults | zhCN defaults |
| --- | --- | --- | --- |
| input / InputLocale | clearLabel | Clear input | 清除输入 |
| datePicker / DatePickerLocale | clearLabel | Clear date | 清除日期 |
| inputNumber / InputNumberLocale | increaseLabel, decreaseLabel | Increase; Decrease | 增加；减少 |
| select / SelectLocale | clearLabel, searchLabel, searchPlaceholder, emptyText | Clear selection; Search options; Search; No options | 清除选择；搜索选项；搜索；暂无选项 |
| select / SelectLocale | removeLabel(label: string): string | Remove {label} | 移除 {label} |
| select (provider-only) | placeholder | Please select | 请选择 |
| upload / UploadLocale | fileListLabel, removeLabel(fileName: string): string | Selected files; Remove {fileName} | 已选择文件；移除 {fileName} |
| pagination / PaginationLocale | pageLabel(page: number): string | Page {page} | 第 {page} 页 |
| pagination / PaginationLocale | jumpBackwardLabel, jumpForwardLabel, pageSizeLabel | Jump backward; Jump forward; Page size | 向前跳页；向后跳页；每页条数 |
| pagination / PaginationLocale | pageSizeText(size: number): string | {size} / page | {size} 条 / 页 |
| pagination / PaginationLocale | jumpText, jumpLabel | Go to; Go to page | 跳至；跳转到页码 |
| pagination (provider-only) | ariaLabel, prevText, nextText | Pagination; Previous; Next | 分页；上一页；下一页 |

Select formats plain string/number option labels directly; rich ReactNode labels use the stable option value rather than stringifying an object. A product can customize the formatter for those values. Pagination preserves actual ReactNode prev/next content as the accessible name instead of coercing it to a string.

```tsx
import { ConfigProvider, zhCN, Input, Select } from '@gouno/ui/core';

<ConfigProvider locale={zhCN}>
  <Input aria-label="标题" allowClear defaultValue="示例" />
  <Input aria-label="检索词" allowClear locale={{ clearLabel: '重置检索词' }} />
  <Select aria-label="发布状态" placeholder="选择发布状态" />
</ConfigProvider>
```

## Compatibility and limits

Existing value, event and ref contracts remain in place. No previously required business/accessibility labels on other Core components become optional. No general translation engine or plural-rule engine is introduced; applications can supply their own typed formatter functions.

Some former Chinese defaults in Select and Upload become English when no provider is configured. Chinese applications should wrap their consuming subtree in `ConfigProvider locale={zhCN}`. Existing explicit text is unchanged. Product fixtures select zhCN at the Showcase integration boundary; direct isolated component demos default to English. No downstream vendored artifact is modified by this work.

Select clear/tag controls are independent native buttons; clearing calls the existing change/clear callbacks and returns focus to the trigger without opening a popup. Generated IDs make unnamed-instance associations unique; searchable Select keeps active-descendant on the focused search input. Input measures its suffix and reserves enough input space for both suffix and clear action; suffix truncation bounds it on narrow controls.

## Review evidence

- `tests/core-localization.test.tsx`: defaults, nested providers, overrides, dynamic changes, portal copy, dynamic labels and ReactNode navigation text.
- `tests/core-select-interaction.test.tsx`: keyboard clear, controlled requests, disabled tag removal, unique ARIA associations, search focus and input clearing.
- `showcase/demos/core/config-provider/`: same-source default and bilingual interactive examples.
- `docs/ui-interaction-review.md`: actual browser matrix and limitations, updated after validation.

Public API default changes are documented in Unreleased. This change does not publish a package or assign a new release tag.
