import type { ComponentDocument } from "../../components/component-page";
import TreeControlledExample from "./tree/tree-0";
import TreeControlledExampleSource from "./tree/tree-0.tsx?raw";
import TreeAsyncExample from "./tree/tree-1";
import TreeAsyncExampleSource from "./tree/tree-1.tsx?raw";

const publicSource = (source: string) =>
  source.replaceAll("../../../../src/core", "@gouno/ui/core");

export const treeDocuments: Record<string, ComponentDocument> = {
  tree: {
    title: "Tree 树形控件",
    description:
      "用于展示和操作层级数据。采用稳定 key、受控/非受控展开/选择/勾选模型，支持父子勾选联动、strict 模式、异步加载、图标/连线、过滤高亮、语义槽和完整树键盘导航。",
    code: publicSource(TreeControlledExampleSource),
    render: () => <TreeControlledExample />,
    demos: [
      {
        title: "异步加载",
        description:
          "isLeaf=false 声明可异步展开；首次展开调用 loadData，并以 switcher loading 状态反馈，完成后通过 loadedKeys 语义避免重复加载。",
        code: publicSource(TreeAsyncExampleSource),
        render: () => <TreeAsyncExample />,
      },
    ],
    api: [
      { name: "treeData", description: "树节点数据；每个节点必须提供稳定且唯一的 key", type: "readonly TreeNode[]" },
      { name: "expandedKeys", description: "受控展开节点 key", type: "readonly Key[]" },
      { name: "defaultExpandedKeys", description: "非受控初始展开节点 key", type: "readonly Key[]", defaultValue: "[]" },
      { name: "defaultExpandAll", description: "初始展开所有已有分支节点", type: "boolean", defaultValue: "false" },
      { name: "selectedKeys", description: "受控选中节点 key", type: "readonly Key[]" },
      { name: "defaultSelectedKeys", description: "非受控初始选中节点 key", type: "readonly Key[]", defaultValue: "[]" },
      { name: "checkedKeys", description: "受控勾选状态；strict 模式可携带 halfChecked", type: "readonly Key[] | { checked: readonly Key[]; halfChecked: readonly Key[] }" },
      { name: "defaultCheckedKeys", description: "非受控初始勾选节点 key", type: "readonly Key[]", defaultValue: "[]" },
      { name: "loadedKeys", description: "受控已完成异步加载的节点 key", type: "readonly Key[]" },
      { name: "checkable", description: "显示并启用节点勾选", type: "boolean", defaultValue: "false" },
      { name: "checkStrictly", description: "关闭父子节点勾选联动，完全独立维护 checked/halfChecked", type: "boolean", defaultValue: "false" },
      { name: "multiple", description: "允许多选；Ctrl/Command 点击追加或移除选择", type: "boolean", defaultValue: "false" },
      { name: "selectable", description: "允许选择节点", type: "boolean", defaultValue: "true" },
      { name: "disabled", description: "禁用整棵树的交互", type: "boolean", defaultValue: "false" },
      { name: "blockNode", description: "节点交互面占满可用宽度", type: "boolean", defaultValue: "false" },
      { name: "showIcon", description: "显示节点图标", type: "boolean", defaultValue: "false" },
      { name: "showLine", description: "显示层级连接线", type: "boolean", defaultValue: "false" },
      { name: "icon", description: "默认节点图标或按节点状态渲染的图标", type: "ReactNode | ((info: TreeNodeRenderInfo) => ReactNode)" },
      { name: "switcherIcon", description: "展开/收起图标或按节点状态渲染", type: "ReactNode | ((info: TreeNodeRenderInfo) => ReactNode)" },
      { name: "switcherLoadingIcon", description: "异步加载期间替换默认 Spinner 的图标", type: "ReactNode" },
      { name: "titleRender", description: "统一自定义节点标题渲染", type: "(node: TreeNode) => ReactNode" },
      { name: "filterTreeNode", description: "返回 true 的节点获得稳定 data-filter-match 状态，供搜索高亮", type: "(node: TreeNode) => boolean" },
      { name: "loadData", description: "首次展开非叶节点时异步加载子节点", type: "(node: TreeNode) => Promise<void>" },
      { name: "onExpand", description: "展开状态变化回调", type: "(expandedKeys: Key[], info: TreeExpandInfo) => void" },
      { name: "onSelect", description: "选择状态变化回调", type: "(selectedKeys: Key[], info: TreeSelectInfo) => void" },
      { name: "onCheck", description: "勾选状态变化回调；info 同时提供 checkedNodes 与 halfCheckedKeys", type: "(checkedKeys: TreeCheckedKeys, info: TreeCheckInfo) => void" },
      { name: "onLoad", description: "异步节点加载成功后的回调", type: "(loadedKeys: Key[], info: { node: TreeNode }) => void" },
      { name: "classNames", description: "按稳定语义槽追加 className，可读取组件级状态", type: "TreeClassNames" },
      { name: "styles", description: "按稳定语义槽追加 style，可读取组件级状态", type: "TreeStyles" },
      { name: "ref", description: "真实 role=tree 根元素引用", type: "Ref<HTMLDivElement>" },
    ],
    apiSections: [
      {
        title: "TreeNode API",
        rows: [
          { name: "key", description: "节点稳定唯一标识；驱动展开、选择、勾选和加载状态", type: "Key" },
          { name: "title", description: "节点标题", type: "ReactNode" },
          { name: "children", description: "子节点", type: "readonly TreeNode[]" },
          { name: "disabled", description: "禁用该节点及其当前交互", type: "boolean" },
          { name: "selectable", description: "覆盖该节点是否可选择", type: "boolean" },
          { name: "checkable", description: "覆盖该节点是否显示勾选控制", type: "boolean" },
          { name: "disableCheckbox", description: "仅禁用该节点的勾选控制", type: "boolean" },
          { name: "icon", description: "覆盖默认节点图标", type: "ReactNode | ((info: TreeNodeRenderInfo) => ReactNode)" },
          { name: "isLeaf", description: "显式声明叶节点；false 可与 loadData 组合为待加载分支", type: "boolean" },
        ],
      },
      {
        title: "Selection / Check model",
        description:
          "默认勾选会向下传导并向上汇总；部分子节点勾选时父节点进入 mixed/indeterminate。checkStrictly=true 时各节点完全独立。",
        rows: [
          { name: "selectedKeys", description: "选择状态采用数组，以同一模型覆盖单选和多选", type: "Key[]" },
          { name: "checkedKeys", description: "默认联动模式返回完整已勾选 key", type: "Key[]" },
          { name: "halfCheckedKeys", description: "onCheck info 中返回半选祖先 key", type: "Key[]" },
          { name: "strict checkedKeys", description: "严格模式可显式控制 checked 与 halfChecked", type: "{ checked: Key[]; halfChecked: Key[] }" },
        ],
      },
      {
        title: "Keyboard / Accessibility",
        description:
          "采用 WAI-ARIA tree/treeitem 语义和 roving tabindex；展开、选择、勾选与层级导航均可只用键盘完成。",
        rows: [
          { name: "Arrow Up / Down", description: "在当前可见节点间移动焦点", type: "keyboard" },
          { name: "Arrow Right", description: "展开当前分支；已展开时进入第一个子节点", type: "keyboard" },
          { name: "Arrow Left", description: "收起当前分支；已收起时回到父节点", type: "keyboard" },
          { name: "Home / End", description: "移动到第一个 / 最后一个可见节点", type: "keyboard" },
          { name: "Enter", description: "选择当前节点", type: "keyboard" },
          { name: "Space", description: "checkable 时切换勾选，否则执行选择", type: "keyboard" },
          { name: "ARIA state", description: "treeitem 暴露 level/posinset/setsize/expanded/selected/checked(mixed)/disabled/busy", type: "semantic state" },
        ],
      },
      {
        title: "Semantic DOM",
        description:
          "classNames/styles 对稳定语义槽开放定制，不要求调用方依赖内部 ul/li 层级。",
        rows: [
          { name: "root", description: "role=tree 根容器", type: "semantic slot" },
          { name: "item", description: "role=treeitem 节点交互面", type: "semantic slot" },
          { name: "switcher", description: "展开/收起控制", type: "semantic slot" },
          { name: "checkbox", description: "勾选控制", type: "semantic slot" },
          { name: "icon", description: "节点图标", type: "semantic slot" },
          { name: "title", description: "节点标题", type: "semantic slot" },
          { name: "group", description: "子节点 role=group 容器", type: "semantic slot" },
        ],
      },
    ],
  },
};
