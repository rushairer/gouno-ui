import {
  Card,
  CardContent,
  CardHeader,
  ConfigProvider,
  Pagination,
  Select,
  Space,
  Text,
  enUS,
  zhCN,
  type ComponentLocale,
} from "../../../../src/core";

interface LocalePanelProps {
  locale: ComponentLocale;
  title: string;
  description: string;
  selectLabel: string;
  overrideLabel: string;
  overridePlaceholder: string;
  paginationLabel: string;
}

function LocalePanel({
  locale,
  title,
  description,
  selectLabel,
  overrideLabel,
  overridePlaceholder,
  paginationLabel,
}: LocalePanelProps) {
  return (
    <ConfigProvider locale={locale}>
      <Card padding="sm">
        <CardHeader title={title} description={description} />
        <CardContent>
          <Space orientation="vertical" gap="md" className="w-full">
            <div className="flex flex-col gap-1">
              <Text size="sm" weight="medium">
                Provider 默认 Select 文案
              </Text>
              <Select aria-label={selectLabel}>
                <option value="draft">Draft / 草稿</option>
                <option value="ready">Ready / 已准备</option>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <Text size="sm" weight="medium">
                显式业务 placeholder 优先
              </Text>
              <Select
                aria-label={overrideLabel}
                placeholder={overridePlaceholder}
              >
                <option value="draft">Draft / 草稿</option>
                <option value="ready">Ready / 已准备</option>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <Text size="sm" weight="medium">
                Pagination 通用操作文案
              </Text>
              <Pagination
                total={200}
                showQuickJumper
                showSizeChanger
                ariaLabel={paginationLabel}
              />
            </div>
          </Space>
        </CardContent>
      </Card>
    </ConfigProvider>
  );
}

export default function LocalizedControlsExample() {
  return (
    <div className="grid w-full min-w-0 gap-4 lg:grid-cols-2">
      <LocalePanel
        locale={zhCN}
        title="zh-CN Provider"
        description="无需交互即可看到“请选择 / 上一页 / 下一页 / 跳至”等中文组件文案。"
        selectLabel="中文 Provider 默认 Select"
        overrideLabel="中文 Provider 业务覆盖 Select"
        overridePlaceholder="业务自定义占位文案"
        paginationLabel="中文 Provider 分页"
      />
      <LocalePanel
        locale={enUS}
        title="en-US Provider"
        description="The same controls visibly render Please select, Previous, Next and Go to."
        selectLabel="English provider default Select"
        overrideLabel="English provider product override Select"
        overridePlaceholder="Product-owned placeholder"
        paginationLabel="English provider pagination"
      />
    </div>
  );
}
