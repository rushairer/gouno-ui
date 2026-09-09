import { Breadcrumb, Collapse, Menu, Steps } from "../../../src/core";
import type { ComponentDocument } from "../../components/component-page";
import { anchorDocument } from "./anchor";
import { dropdownDocument } from "./dropdown";
import { paginationDocument } from "./pagination";
import { tabsDocument } from "./tabs";

export const navigationDocuments: Record<string, ComponentDocument> = {
  breadcrumb: {
    title: "Breadcrumb 面包屑",
    description: "表达当前页面在信息架构中的位置。",
    code: '<Breadcrumb items={[{ label: "首页", href: "/" }, { label: "组件" }]} />',
    render: () => (
      <Breadcrumb
        items={[
          { label: "首页", href: "#" },
          { label: "Core" },
          { label: "Breadcrumb" },
        ]}
      />
    ),
  },
  pagination: paginationDocument,
  steps: {
    title: "Steps 步骤条",
    description: "展示流程进度和当前步骤。",
    code: '<Steps current={1} items={[{ title: "填写" }, { title: "确认" }]} />',
    render: () => (
      <Steps
        current={1}
        items={[
          { title: "填写信息", description: "基本资料" },
          { title: "确认订单" },
          { title: "完成" },
        ]}
      />
    ),
  },
  anchor: anchorDocument,
  tabs: tabsDocument,
  collapse: {
    title: "Collapse 折叠面板",
    description: "展开一个或多个内容区域。",
    code: '<Collapse items={items} />',
    render: () => (
      <Collapse
        defaultActiveKeys={["1"]}
        items={[
          { key: "1", label: "什么是 Core？", children: "产品无关的基础组件。" },
          { key: "2", label: "是否支持键盘？", children: "交互组件均提供语义与焦点行为。" },
        ]}
      />
    ),
  },
  dropdown: dropdownDocument,
  menu: {
    title: "Menu 菜单",
    description: "垂直或水平的可访问操作导航。",
    code: '<Menu items={items} selectedKeys={["home"]} />',
    render: () => (
      <Menu
        ariaLabel="示例菜单"
        selectedKeys={["home"]}
        items={[
          { key: "home", label: "首页" },
          { key: "components", label: "组件" },
          { key: "disabled", label: "禁用", disabled: true },
        ]}
      />
    ),
  },
};
