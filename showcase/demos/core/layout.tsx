import { Button, Card, CardContent, CardHeader, Flex, Grid, Layout, LayoutContent, LayoutFooter, LayoutHeader, LayoutSider, Separator, Space, Splitter, Text } from "../../../src/core";
import type { ComponentDocument } from "../../components/component-page";
export const layoutDocuments: Record<string, ComponentDocument> = {
  space: { title: "Space 间距", description: "统一水平或垂直元素间距。", code: '<Space size="lg"><Button>A</Button><Button>B</Button></Space>', render: () => <Space size="lg"><Button>A</Button><Button>B</Button><Button>C</Button></Space> },
  flex: { title: "Flex 弹性布局", description: "对齐、分布、换行和方向。", code: '<Flex justify="between" align="center">...</Flex>', render: () => <Flex justify="between" align="center"><Text>左侧</Text><Button>右侧操作</Button></Flex> },
  grid: { title: "Grid 网格", description: "固定列或自动适配的响应式网格。", code: '<Grid columns={3}>...</Grid>', render: () => <Grid columns={3}>{[1,2,3].map(i => <Card key={i} padding="sm">Card {i}</Card>)}</Grid> },
  separator: { title: "Separator 分隔线", description: "在内容区域之间建立视觉层级。", code: '<Separator />', render: () => <Space direction="vertical"><Text>第一部分</Text><Separator /><Text>第二部分</Text></Space> },
  card: { title: "Card 卡片", description: "内容分组、操作和交互表面。", code: '<Card><CardHeader title="标题" /><CardContent>内容</CardContent></Card>', render: () => <Card><CardHeader title="卡片标题" description="补充说明" /><CardContent>卡片正文内容</CardContent></Card> },
  splitter: { title:"Splitter 分隔面板", description:"通过拖动分隔条调整两个面板尺寸。", code:'<Splitter first={<PanelA />} second={<PanelB />} />', render:()=> <Splitter first={<div className="p-4">左侧面板</div>} second={<div className="p-4">右侧面板</div>} /> },
  "page-layout": { title:"Layout 页面布局", description:"Header、Sider、Content、Footer 的基础页面骨架。", code:'<Layout><LayoutHeader /><LayoutContent /></Layout>', render:()=> <Layout className="min-h-64 border"><LayoutHeader>Header</LayoutHeader><div className="flex flex-1"><LayoutSider>Sider</LayoutSider><LayoutContent>Content</LayoutContent></div><LayoutFooter>Footer</LayoutFooter></Layout> }
};
