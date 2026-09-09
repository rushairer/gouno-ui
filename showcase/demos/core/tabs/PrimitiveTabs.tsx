import { Tab, TabList, TabPanel, Tabs, Text } from "../../../../src/core";

export function PrimitiveTabs() {
  return (
    <Tabs defaultActiveKey="overview">
      <TabList aria-label="项目设置" type="line" size="middle">
        <Tab value="overview" size="middle">
          概览
        </Tab>
        <Tab value="security" size="middle">
          安全
        </Tab>
        <Tab value="billing" size="middle" disabled>
          账单
        </Tab>
      </TabList>
      <TabPanel value="overview">
        <Text>项目概览内容</Text>
      </TabPanel>
      <TabPanel value="security">
        <Text>安全设置内容</Text>
      </TabPanel>
      <TabPanel value="billing">
        <Text>账单内容</Text>
      </TabPanel>
    </Tabs>
  );
}
