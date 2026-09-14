import { PageSkeleton } from "../../../../src/gouno";

export default function GounoPageSkeletonExample() {
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <h3 className="text-base font-semibold">Collection</h3>
        <PageSkeleton
          layout="collection"
          aria-label="资源列表加载中"
          rows={4}
          columns={5}
          pagination
        />
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-base font-semibold">Form</h3>
        <PageSkeleton layout="form" aria-label="设置表单加载中" fields={6} />
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-base font-semibold">Dashboard</h3>
        <PageSkeleton
          layout="dashboard"
          aria-label="数据概览加载中"
          statistics={4}
          sections={2}
        />
      </section>
    </div>
  );
}
