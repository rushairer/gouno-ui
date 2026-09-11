from pathlib import Path


def read(path: str) -> str:
    return Path(path).read_text(encoding="utf-8")


def write(path: str, content: str) -> None:
    target = Path(path)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content, encoding="utf-8")


def replace(path: str, old: str, new: str) -> None:
    text = read(path)
    if old not in text:
        raise SystemExit(f"missing replacement marker in {path}: {old[:100]!r}")
    write(path, text.replace(old, new, 1))


# Expose the canonical compound anatomy without adding another top-level runtime export.
replace(
    "src/core/splitter.tsx",
    "export const Splitter = forwardRef<HTMLDivElement, SplitterProps>(function Splitter(",
    "const SplitterRoot = forwardRef<HTMLDivElement, SplitterProps>(function Splitter(",
)
text = read("src/core/splitter.tsx")
if "export const Splitter = Object.assign" not in text:
    write(
        "src/core/splitter.tsx",
        text.rstrip()
        + '\n\nexport const Splitter = Object.assign(SplitterRoot, {\n  Panel: SplitterPanel,\n});\n',
    )

# Showcase demos.
write(
    "showcase/demos/core/splitter/splitter-0.tsx",
    '''import { Splitter } from "../../../../src/core";

export default function SplitterBasicDemo() {
  return (
    <Splitter defaultSizes={[36, 64]} className="h-44">
      <Splitter.Panel min={20} max={70} className="p-4">
        <strong>Navigation</strong>
        <p className="mt-2 text-sm text-muted-foreground">拖动或聚焦分隔条后使用方向键调整。</p>
      </Splitter.Panel>
      <Splitter.Panel className="p-4">
        <strong>Workspace</strong>
        <p className="mt-2 text-sm text-muted-foreground">Panel 只拥有尺寸约束与内容区域。</p>
      </Splitter.Panel>
    </Splitter>
  );
}
''',
)

write(
    "showcase/demos/core/splitter/splitter-1.tsx",
    '''import { Splitter } from "../../../../src/core";

export default function SplitterMultipleDemo() {
  return (
    <Splitter orientation="vertical" defaultSizes={[28, 42, 30]} className="h-64">
      <Splitter.Panel min={18} className="p-3">Inspector</Splitter.Panel>
      <Splitter.Panel min={24} className="p-3">Canvas</Splitter.Panel>
      <Splitter.Panel min={18} className="p-3">Console</Splitter.Panel>
    </Splitter>
  );
}
''',
)

# Replace the old inline Splitter preview with source-trusted demos and complete API docs.
replace(
    "showcase/demos/core/layout.tsx",
    'import { Space, Splitter } from "../../../src/core";',
    'import { Space } from "../../../src/core";',
)
replace(
    "showcase/demos/core/layout.tsx",
    'import PageLayoutDemoSource from "./page-layout/page-layout-0.tsx?raw";\n',
    'import PageLayoutDemoSource from "./page-layout/page-layout-0.tsx?raw";\nimport SplitterBasicDemo from "./splitter/splitter-0";\nimport SplitterBasicDemoSource from "./splitter/splitter-0.tsx?raw";\nimport SplitterMultipleDemo from "./splitter/splitter-1";\nimport SplitterMultipleDemoSource from "./splitter/splitter-1.tsx?raw";\n',
)
replace(
    "showcase/demos/core/layout.tsx",
    '''  splitter: {
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
''',
    '''  splitter: {
    title: "Splitter 分隔面板",
    description:
      "可访问的可调面板容器。canonical API 使用 Splitter.Panel 组合多个区域；orientation 沿用 Gouno 轴向词汇，sizes/defaultSizes 管理完整尺寸向量，Panel 负责 min/max/resizable 约束。旧 first/second API 仅保留兼容。",
    code: canonicalCoreSource(SplitterBasicDemoSource),
    render: () => <SplitterBasicDemo />,
    demos: [
      {
        title: "垂直多面板",
        description:
          "同一 Splitter 支持三个及以上 Panel；分隔条可拖动，也可聚焦后用方向键、Home/End 调整相邻面板。",
        code: canonicalCoreSource(SplitterMultipleDemoSource),
        render: () => <SplitterMultipleDemo />,
      },
    ],
    api: [
      { name: "children", description: "canonical 直接子项使用 Splitter.Panel。", type: "ReactNode" },
      { name: "orientation", description: "面板排列轴向；水平排列对应垂直 separator。", type: '\"horizontal\" | \"vertical\"', defaultValue: '\"horizontal\"' },
      { name: "sizes", description: "受控完整尺寸向量；数值按比例归一化为 100%。", type: "readonly number[]" },
      { name: "defaultSizes", description: "非受控初始尺寸向量。", type: "readonly number[]" },
      { name: "onSizesChange", description: "拖动或键盘调整后的完整尺寸向量。", type: "(sizes: readonly number[]) => void" },
      { name: "onResizeStart / onResizeEnd", description: "一次调整开始/结束时的尺寸快照。", type: "(sizes: readonly number[]) => void" },
      { name: "step", description: "键盘方向键每次调整的百分比；Shift 为五倍步长。", type: "number", defaultValue: "1" },
      { name: "first / second", description: "兼容旧二面板 API；新代码使用 Splitter.Panel。", type: "ReactNode", defaultValue: "deprecated" },
      { name: "defaultSize / min / max / onResize", description: "旧 first-panel 兼容契约；onResize 继续返回首面板 number。", type: "legacy compatibility", defaultValue: "deprecated" },
      { name: "...div props", description: "透传根 div 的标准属性、事件、data-* 与 ARIA。", type: "HTMLAttributes<HTMLDivElement>" },
      { name: "ref", description: "指向真实 Splitter 根 div。", type: "Ref<HTMLDivElement>" },
    ],
    apiSections: [
      {
        title: "Splitter.Panel API",
        rows: [
          { name: "defaultSize", description: "未提供 root defaultSizes 时的初始占比。", type: "number" },
          { name: "min", description: "调整时允许的最小占比。", type: "number", defaultValue: "0" },
          { name: "max", description: "调整时允许的最大占比。", type: "number", defaultValue: "100" },
          { name: "resizable", description: "false 时禁用该 Panel 两侧相邻的 resize handle。", type: "boolean", defaultValue: "true" },
          { name: "children", description: "Panel 内容。", type: "ReactNode" },
          { name: "...div props", description: "透传真实 Panel div 属性并支持 ref。", type: "HTMLAttributes<HTMLDivElement>" },
        ],
      },
    ],
  },
''',
)

# Completion state: only after this workflow validates source, docs, a11y and tests together.
replace(
    "showcase/component-progress.ts",
    '  "core-separator",\n',
    '  "core-separator",\n  "core-splitter",\n',
)
replace(
    "showcase/catalog.tsx",
    'item("core-splitter", "Splitter", "分隔面板", 68, <Columns3 />)',
    'item("core-splitter", "Splitter", "分隔面板", 100, <Columns3 />)',
)
replace(
    "tests/component-progress.test.ts",
    '      "core-separator",\n',
    '      "core-separator",\n      "core-splitter",\n',
)

# Focused family contract tests.
write(
    "tests/core-splitter-6b2.test.tsx",
    '''import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Splitter } from "../src/core";
import { layoutDocuments } from "../showcase/demos/core/layout";

describe("Core Splitter 6B2", () => {
  it("renders canonical multi-panel anatomy with accessible separators", () => {
    const { container } = render(
      <Splitter defaultSizes={[20, 50, 30]}>
        <Splitter.Panel>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
        <Splitter.Panel>C</Splitter.Panel>
      </Splitter>,
    );

    expect(container.querySelectorAll('[data-slot="splitter-panel"]')).toHaveLength(3);
    const handles = screen.getAllByRole("separator");
    expect(handles).toHaveLength(2);
    expect(handles[0].getAttribute("aria-orientation")).toBe("vertical");
    expect(handles[0].getAttribute("aria-valuenow")).toBe("20");
  });

  it("supports keyboard resizing, constraints and lifecycle callbacks", () => {
    const onSizesChange = vi.fn();
    const onResizeStart = vi.fn();
    const onResizeEnd = vi.fn();
    render(
      <Splitter
        defaultSizes={[40, 60]}
        step={2}
        onSizesChange={onSizesChange}
        onResizeStart={onResizeStart}
        onResizeEnd={onResizeEnd}
      >
        <Splitter.Panel min={35} max={45}>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>,
    );

    const handle = screen.getByRole("separator");
    fireEvent.keyDown(handle, { key: "ArrowRight" });
    expect(onSizesChange).toHaveBeenLastCalledWith([42, 58]);
    expect(onResizeStart).toHaveBeenCalledWith([40, 60]);
    expect(onResizeEnd).toHaveBeenLastCalledWith([42, 58]);

    fireEvent.keyDown(handle, { key: "End" });
    expect(onSizesChange).toHaveBeenLastCalledWith([45, 55]);
  });

  it("keeps controlled sizes caller-owned while reporting proposed vectors", () => {
    const onSizesChange = vi.fn();
    const { container } = render(
      <Splitter sizes={[30, 70]} onSizesChange={onSizesChange}>
        <Splitter.Panel>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>,
    );

    fireEvent.keyDown(screen.getByRole("separator"), { key: "ArrowRight" });
    expect(onSizesChange).toHaveBeenLastCalledWith([31, 69]);
    const panels = container.querySelectorAll<HTMLElement>('[data-slot="splitter-panel"]');
    expect(panels[0].style.flexGrow).toBe("30");
    expect(panels[1].style.flexGrow).toBe("70");
  });

  it("disables a handle when either adjacent panel is non-resizable", () => {
    const onSizesChange = vi.fn();
    render(
      <Splitter onSizesChange={onSizesChange}>
        <Splitter.Panel resizable={false}>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>,
    );

    const handle = screen.getByRole("separator");
    expect(handle.getAttribute("aria-disabled")).toBe("true");
    expect(handle.tabIndex).toBe(-1);
    fireEvent.keyDown(handle, { key: "ArrowRight" });
    expect(onSizesChange).not.toHaveBeenCalled();
  });

  it("retains the legacy two-panel callback contract", () => {
    const onResize = vi.fn();
    render(<Splitter first={<div>A</div>} second={<div>B</div>} defaultSize={25} onResize={onResize} />);

    fireEvent.keyDown(screen.getByRole("separator"), { key: "ArrowRight" });
    expect(onResize).toHaveBeenLastCalledWith(26);
  });

  it("forwards the root ref and documents source-trusted compound demos", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Splitter ref={ref} data-testid="splitter-ref">
        <Splitter.Panel>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>,
    );
    expect(ref.current).toBe(screen.getByTestId("splitter-ref"));

    const document = layoutDocuments.splitter;
    expect(document.code).toContain('from "@gouno/ui/core"');
    expect(document.code).toContain("<Splitter.Panel");
    expect(document.demos?.[0]?.code).toContain('orientation="vertical"');
    expect(document.apiSections?.map((section) => section.title)).toContain("Splitter.Panel API");
  });
});
''',
)
