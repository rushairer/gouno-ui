import { useState } from "react";
import { Button, Space } from "../../../../src/core";

export default function ButtonStateDemo() {
  const [loading, setLoading] = useState(false);

  return (
    <Space orientation="vertical">
      <Space wrap className="items-center">
        <Button size="small">Small</Button>
        <Button size="middle">Middle</Button>
        <Button size="large">Large</Button>
        <Button variant="solid" color="error">
          危险操作
        </Button>
        <Button
          variant="solid"
          color="primary"
          loading={loading}
          loadingText="保存中"
          onClick={() => setLoading(true)}
        >
          保存
        </Button>
        <Button onClick={() => setLoading((value) => !value)}>
          {loading ? "结束加载" : "模拟加载"}
        </Button>
        <Button disabled>禁用</Button>
      </Space>
      <Button block shape="round">
        Block + Round
      </Button>
    </Space>
  );
}
