import { Plus, RefreshCw } from "lucide-react";
import { Button } from "../../../../src/core";
import { PageHeader } from "../../../../src/gouno";

export default function GounoPageHeaderExample() {
  return (
    <PageHeader
      title="OAuth2 客户端"
      description="注册和维护身份平台客户端、回调地址与授权范围。"
      actions={
        <>
          <Button icon={<RefreshCw />}>刷新</Button>
          <Button variant="solid" color="primary" icon={<Plus />}>
            注册客户端
          </Button>
        </>
      }
    />
  );
}
