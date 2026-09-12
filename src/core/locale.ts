/** Generic component copy only. Product labels and content remain caller-owned. */
export interface InputLocale { clearLabel: string; }
export interface DatePickerLocale { clearLabel: string; }
export interface InputNumberLocale { increaseLabel: string; decreaseLabel: string; }
export interface SelectLocale {
  clearLabel: string;
  searchLabel: string;
  searchPlaceholder: string;
  emptyText: string;
  removeLabel: (label: string) => string;
}
export interface UploadLocale {
  fileListLabel: string;
  removeLabel: (fileName: string) => string;
}
export interface PaginationLocale {
  pageLabel: (page: number) => string;
  jumpBackwardLabel: string;
  jumpForwardLabel: string;
  pageSizeLabel: string;
  pageSizeText: (size: number) => string;
  jumpText: string;
  jumpLabel: string;
}
export interface ComponentLocale {
  readonly locale: string;
  readonly input: Readonly<InputLocale>;
  readonly datePicker: Readonly<DatePickerLocale>;
  readonly inputNumber: Readonly<InputNumberLocale>;
  readonly select: Readonly<SelectLocale & { placeholder: string }>;
  readonly upload: Readonly<UploadLocale>;
  readonly pagination: Readonly<PaginationLocale & { ariaLabel: string; prevText: string; nextText: string }>;
}

export const enUS: ComponentLocale = {
  locale: "en-US",
  input: { clearLabel: "Clear input" },
  datePicker: { clearLabel: "Clear date" },
  inputNumber: { increaseLabel: "Increase", decreaseLabel: "Decrease" },
  select: {
    placeholder: "Please select", clearLabel: "Clear selection", searchLabel: "Search options",
    searchPlaceholder: "Search", emptyText: "No options", removeLabel: (label) => `Remove ${label}`,
  },
  upload: { fileListLabel: "Selected files", removeLabel: (name) => `Remove ${name}` },
  pagination: {
    ariaLabel: "Pagination", prevText: "Previous", nextText: "Next", pageLabel: (page) => `Page ${page}`,
    jumpBackwardLabel: "Jump backward", jumpForwardLabel: "Jump forward", pageSizeLabel: "Page size",
    pageSizeText: (size) => `${size} / page`, jumpText: "Go to", jumpLabel: "Go to page",
  },
};

export const zhCN: ComponentLocale = {
  locale: "zh-CN",
  input: { clearLabel: "清除输入" },
  datePicker: { clearLabel: "清除日期" },
  inputNumber: { increaseLabel: "增加", decreaseLabel: "减少" },
  select: {
    placeholder: "请选择", clearLabel: "清除选择", searchLabel: "搜索选项",
    searchPlaceholder: "搜索", emptyText: "暂无选项", removeLabel: (label) => `移除 ${label}`,
  },
  upload: { fileListLabel: "已选择文件", removeLabel: (name) => `移除 ${name}` },
  pagination: {
    ariaLabel: "分页", prevText: "上一页", nextText: "下一页", pageLabel: (page) => `第 ${page} 页`,
    jumpBackwardLabel: "向前跳页", jumpForwardLabel: "向后跳页", pageSizeLabel: "每页条数",
    pageSizeText: (size) => `${size} 条 / 页`, jumpText: "跳至", jumpLabel: "跳转到页码",
  },
};
