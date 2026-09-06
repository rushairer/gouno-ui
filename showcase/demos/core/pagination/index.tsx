import { BasicPagination } from "./BasicPagination";
import BasicPaginationSource from "./BasicPagination.tsx?raw";
import { ControlledPagination } from "./ControlledPagination";
import ControlledPaginationSource from "./ControlledPagination.tsx?raw";
import { PaginationVariants } from "./PaginationVariants";
import PaginationVariantsSource from "./PaginationVariants.tsx?raw";
import { PaginationBoundaries } from "./PaginationBoundaries";
import PaginationBoundariesSource from "./PaginationBoundaries.tsx?raw";
import type { ComponentDocument } from "../../../components/component-page";

// Every example displays the same executable module used by the preview.
export const paginationDocument: ComponentDocument = {
  title: "Pagination 分页",
  description:
    "页码、快速跳转、页大小、总数和受控状态。Code 仅提供当前示例及必要导入，可直接复制复现。",
  code: BasicPaginationSource.replaceAll(
    "../../../../src/core",
    "@gouno/ui/core",
  ),
  render: () => <BasicPagination />,
  demos: [
    {
      title: "受控分页、页大小与跳页",
      code: ControlledPaginationSource.replaceAll(
        "../../../../src/core",
        "@gouno/ui/core",
      ),
      render: () => <ControlledPagination />,
    },
    {
      title: "紧凑、简单与自定义",
      code: PaginationVariantsSource.replaceAll(
        "../../../../src/core",
        "@gouno/ui/core",
      ),
      render: () => <PaginationVariants />,
    },
    {
      title: "禁用、末页与空数据",
      code: PaginationBoundariesSource.replaceAll(
        "../../../../src/core",
        "@gouno/ui/core",
      ),
      render: () => <PaginationBoundaries />,
    },
  ],
  api: [
    {
      name: "page",
      type: "number",
      description: "受控当前页；显示值限制在有效页码内",
    },
    {
      name: "defaultPage",
      type: "number",
      defaultValue: "1",
      description: "非受控初始页",
    },
    {
      name: "total",
      type: "number",
      description: "必填，总记录数；负数或非有限值按 0 处理",
    },
    {
      name: "pageSize",
      type: "number",
      description: "受控每页条数；非正数按 10 处理",
    },
    {
      name: "defaultPageSize",
      type: "number",
      defaultValue: "10",
      description: "非受控初始每页条数",
    },
    {
      name: "onChange",
      type: "(page: number, pageSize: number) => void",
      description: "页码或页大小变化；受控时由调用者更新值",
    },
    {
      name: "onShowSizeChange",
      type: "(page: number, pageSize: number) => void",
      description: "用户修改页大小后的通知，同时触发 onChange",
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: "禁用所有按钮、跳页输入和页大小选择",
    },
    {
      name: "ariaLabel",
      type: "string",
      defaultValue: '"Pagination"',
      description: "导航区域的可访问名称",
    },
    {
      name: "prevText",
      type: "ReactNode",
      defaultValue: '"Previous"',
      description: "上一页按钮文案，同时作为可访问名称",
    },
    {
      name: "nextText",
      type: "ReactNode",
      defaultValue: '"Next"',
      description: "下一页按钮文案，同时作为可访问名称",
    },
    {
      name: "showSizeChanger",
      type: "boolean",
      defaultValue: "false",
      description: "显示原生页大小选择器",
    },
    {
      name: "pageSizeOptions",
      type: "number[]",
      defaultValue: "[10, 20, 50, 100]",
      description: "页大小选项；去重并移除无效值，自动包含当前值",
    },
    {
      name: "showQuickJumper",
      type: "boolean",
      defaultValue: "false",
      description: "显示跳页输入；Enter 或失焦提交，自动限制边界",
    },
    {
      name: "showTotal",
      type: "(total: number, range: [number, number]) => ReactNode",
      description: "渲染总数与本页范围；空数据范围为 [0, 0]",
    },
    {
      name: "hideOnSinglePage",
      type: "boolean",
      defaultValue: "false",
      description: "总页数为 1 时隐藏，包括空数据",
    },
    {
      name: "simple",
      type: "boolean",
      defaultValue: "false",
      description: "只显示上一页、当前页状态和下一页",
    },
    {
      name: "showLessItems",
      type: "boolean",
      defaultValue: "false",
      description: "减少当前页两侧的页码数量",
    },
    {
      name: "size",
      type: '"small" | "middle"',
      defaultValue: '"middle"',
      description: "页码按钮尺寸",
    },
    {
      name: "align",
      type: '"start" | "center" | "end"',
      defaultValue: '"start"',
      description: "导航在容器内的对齐方式",
    },
    { name: "className", type: "string", description: "导航容器类名" },
    {
      name: "itemRender",
      type: '(page: number, type: "page" | "prev" | "next", originalElement: ReactNode) => ReactNode',
      description:
        "自定义按钮内容，事件、ARIA 与禁用仍由组件管理；不要返回嵌套交互元素",
    },
  ],
};
