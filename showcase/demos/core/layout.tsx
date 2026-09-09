import {
  Button,
  Card,
  Flex,
  Grid,
  Separator,
  Space,
  Splitter,
  Text,
} from "../../../src/core";
import type { ComponentDocument } from "../../components/component-page";
import PageLayoutDemo from "./page-layout/page-layout-0";
import PageLayoutDemoSource from "./page-layout/page-layout-0.tsx?raw";
import SpaceBasicDemo from "./space/space-0";
import SpaceBasicDemoSource from "./space/space-0.tsx?raw";
import SpaceAlignmentDemo from "./space/space-1";
import SpaceAlignmentDemoSource from "./space/space-1.tsx?raw";
import SpaceWrapSplitDemo from "./space/space-2";
import SpaceWrapSplitDemoSource from "./space/space-2.tsx?raw";

const nativeRegionApi = [
  {
    name: "children",
    description: "区域内容。",
    type: "ReactNode",
  },
  {
    name: "className",
    description: "在 canonical region 样式之上扩展布局。",
    type: "string",
  },
] as const;

export const layoutDocuments: Record<string, ComponentDocument> = {
  space: {
    title: "Space 间距",
    description:
      "统一水平或垂直元素间距。使用 orientation 表示轴向，gap 表示间距；wrap、split 和 block 覆盖常见操作组布局。",
    code: SpaceBasicDemoSource.replaceAll(
      "../../../../src/core",
      "@gouno/ui/core",
    ),
    render: () => <SpaceBasicDemo />,
    demos: [
      {
        title: "垂直排列与宽度",
        code: SpaceAlignmentDemoSource.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ),
        render: () => <SpaceAlignmentDemo />,
      },
      {
        title: "换行与分隔内容",
        code: SpaceWrapSplitDemoSource.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ),
        render: () => <SpaceWrapSplitDemo />,
      },
    ],
    api: [
      {
        name: "orientation",
        description:
          "排列轴向；对应 Ant Design Space 的 direction 语义，但遵循 Gouno 轴向命名规范",
        type: '"horizontal" | "vertical"',
        defaultValue: '"horizontal"',
      },
      {
        name: "gap",
        description:
          "元素间距 token 或像素值；对应 Ant Design Space 的 size 语义，但遵循 Gouno 间距命名规范",
        type: '"xs" | "sm" | "md" | "lg" | "xl" | number',
        defaultValue: '"md"',
      },
      {
        name: "align",
        description: "交叉轴对齐；未设置时遵循 flex 默认行为，垂直排列为 stretch",
        type: '"start" | "end" | "center" | "baseline" | "stretch"',
      },
      {
        name: "wrap",
        description: "是否允许子项换行",
        type: "boolean",
        defaultValue: "false",
      },
      {
        name: "split",
        description: "在相邻子项之间插入分隔内容",
        type: "ReactNode",
      },
      {
        name: "block",
        description: "让 Space 容器占满父级宽度",
        type: "boolean",
        defaultValue: "false",
      },
      { name: "children", description: "排列的 React 子项", type: "ReactNode" },
      { name: "className", description: "Space 容器样式类", type: "string" },
      { name: "style", description: "Space 容器内联样式", type: "CSSProperties" },
      { name: "ref", description: "Space 根 div 引用", type: "Ref<HTMLDivElement>" },
    ],
  },
  flex: {
    title: "Flex 弹性布局",
    description: "对齐、分布、换行和方向。",
    code: '<Flex justify="space-between" align="center"><Text>左侧</Text><Button>右侧操作</Button></Flex>',
    render: () => (
      <Flex justify="space-between" align="center">
        <Text>左侧</Text>
        <Button>右侧操作</Button>
      </Flex>
    ),
  },
  grid: {
    title: "Grid 网格",
    description: "固定列或自动适配的响应式网格。",
    code: '<Grid columns={3}>{[1, 2, 3].map((item) => <Card key={item} padding="sm">Card {item}</Card>)}</Grid>',
    render: () => (
      <Grid columns={3}>
        {[1, 2, 3].map((item) => (
          <Card key={item} padding="sm">
            Card {item}
          </Card>
        ))}
      </Grid>
    ),
  },
  separator: {
    title: "Separator 分隔线",
    description: "在内容区域之间建立视觉层级。",
    code: "<Separator />",
    render: () => (
      <Space orientation="vertical">
        <Text>第一部分</Text>
        <Separator />
        <Text>第二部分</Text>
      </Space>
    ),
  },
  splitter: {
    title: "Splitter 分隔面板",
    description: "通过拖动分隔条调整两个面板尺寸。",
    code: '<Splitter first={<PanelA />} second={<PanelB />} />',
    render: () => (
      <Splitter
        first={<div className="p-4">左侧面板</div>}
        second={<div className="p-4">右侧面板</div>}
      />
    ),
  },
  "page-layout": {
    title: "Layout 页面布局",
    description:
      "Header、Sider、Content、Footer 的基础语义骨架。各区域只负责结构与默认 surface，不拥有路由、鉴权或产品状态。",
    code: PageLayoutDemoSource.replaceAll(
      "../../../../src/core",
      "@gouno/ui/core",
    ),
    render: () => <PageLayoutDemo />,
    api: [
      {
        name: "children",
        description: "Layout 区域树。",
        type: "ReactNode",
      },
      {
        name: "className",
        description: "在 flex column 应用骨架之上扩展布局。",
        type: "string",
      },
      {
        name: "...div props",
        description: "透传原生 div 属性，包括 data/aria/id/事件。",
        type: "HTMLAttributes<HTMLDivElement>",
      },
    ],
    apiSections: [
      {
        title: "LayoutHeader API",
        rows: [
          ...nativeRegionApi,
          {
            name: "...header props",
            description: "透传原生 header 属性。",
            type: "HTMLAttributes<HTMLElement>",
          },
        ],
      },
      {
        title: "LayoutSider API",
        rows: [
          ...nativeRegionApi,
          {
            name: "...aside props",
            description: "透传原生 aside 属性。",
            type: "HTMLAttributes<HTMLElement>",
          },
        ],
      },
      {
        title: "LayoutContent API",
        rows: [
          ...nativeRegionApi,
          {
            name: "...main props",
            description: "透传原生 main 属性。",
            type: "HTMLAttributes<HTMLElement>",
          },
        ],
      },
      {
        title: "LayoutFooter API",
        rows: [
          ...nativeRegionApi,
          {
            name: "...footer props",
            description: "透传原生 footer 属性。",
            type: "HTMLAttributes<HTMLElement>",
          },
        ],
      },
    ],
  },
};
