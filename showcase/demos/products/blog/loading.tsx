import { Card, Skeleton } from "../../../../src/core";

export function BlogHomeLoading() {
  return (
    <div className="flex flex-col gap-10" role="status" aria-label="首页加载中">
      <div className="grid gap-6 border-b pb-10 md:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <Skeleton className="h-10 w-4/5" />
          <Skeleton className="h-5 w-3/4" />
        </div>
        <Skeleton className="aspect-[4/3] w-full rounded-lg" />
      </div>
      <Skeleton className="h-52 w-full" />
      <div className="grid gap-8 md:grid-cols-2">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}

export function BlogArticleListLoading() {
  return (
    <div role="status" aria-label="文章列表加载中" className="flex flex-col gap-6">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="border-b pb-6">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="mt-3 h-7 w-4/5" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}

export function BlogArticleDetailLoading() {
  return (
    <div role="status" aria-label="文章详情加载中" className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_15rem]">
      <Card padding="none" className="overflow-hidden">
        <Skeleton className="aspect-[16/7] w-full rounded-none" />
        <div className="space-y-6 p-6 sm:p-8">
          <Skeleton className="h-8 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-3">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className={`h-4 ${index % 2 === 0 ? "w-full" : "w-5/6"}`} />
          ))}
        </div>
      </Card>
      <div className="space-y-3">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

export function BlogDiscoveryIndexLoading({
  page,
}: {
  page: "categories" | "tags" | "archive";
}) {
  const count = page === "archive" ? 3 : 6;
  const label = page === "categories" ? "分类" : page === "tags" ? "标签" : "归档";

  return (
    <div role="status" aria-label={`${label}加载中`} className={page === "archive" ? "space-y-8" : "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"}>
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} className={page === "archive" ? "h-24 w-full" : "h-36 w-full rounded-lg"} />
      ))}
    </div>
  );
}

export function BlogCustomPageLoading() {
  return (
    <Card padding="none" className="mx-auto w-full max-w-[900px] overflow-hidden" role="status" aria-label="自定义单页加载中">
      <div className="space-y-6 p-6 sm:p-8">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-px w-full" />
        {Array.from({ length: 7 }, (_, index) => (
          <Skeleton key={index} className={`h-4 ${index % 3 === 0 ? "w-full" : "w-5/6"}`} />
        ))}
      </div>
    </Card>
  );
}

export function BlogNotificationsLoading() {
  return (
    <div role="status" aria-label="通知加载中" className="mx-auto w-full max-w-[900px] space-y-5">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-4/5" />
      {Array.from({ length: 4 }, (_, index) => (
        <Card key={index} padding="sm">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/3" />
        </Card>
      ))}
    </div>
  );
}
