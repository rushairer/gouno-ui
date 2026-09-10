import { Menu, Steps } from "../../../src/core";
import type { ComponentDocument } from "../../components/component-page";
import { anchorDocument } from "./anchor";
import { dropdownDocument } from "./dropdown";
import { paginationDocument } from "./pagination";
import { tabsDocument } from "./tabs";

export const navigationDocuments: Record<string, ComponentDocument> = {
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
