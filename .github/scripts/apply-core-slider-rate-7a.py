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


# Same-source Slider demos.
write(
    "showcase/demos/core/slider/slider-0.tsx",
    '''import { useState } from "react";
import { Slider, Space, Text } from "../../../../src/core";

export default function SliderBasicDemo() {
  const [value, setValue] = useState(40);
  const [committed, setCommitted] = useState(40);

  return (
    <Space orientation="vertical" block>
      <Slider
        aria-label="音量"
        min={0}
        max={100}
        value={value}
        onChange={(event) => setValue(event.currentTarget.valueAsNumber)}
        onChangeComplete={setCommitted}
      />
      <Text tone="muted" size="sm">当前 {value} · 已提交 {committed}</Text>
    </Space>
  );
}
''',
)
write(
    "showcase/demos/core/slider/slider-1.tsx",
    '''import { Slider, Space, Text } from "../../../../src/core";

export default function SliderVerticalDemo() {
  return (
    <Space align="center" gap="lg">
      <Slider aria-label="亮度" orientation="vertical" min={0} max={100} defaultValue={65} />
      <Text tone="muted" size="sm">vertical 保留原生 range 键盘语义。</Text>
    </Space>
  );
}
''',
)

# Same-source Rate demos with caller-owned localized accessible names.
write(
    "showcase/demos/core/rate/rate-0.tsx",
    '''import { Rate, Space, Text } from "../../../../src/core";

export default function RateBasicDemo() {
  return (
    <Space orientation="vertical" gap="sm">
      <Rate
        aria-label="满意度"
        defaultValue={3}
        getItemLabel={(value) => `${value} 分`}
      />
      <Text tone="muted" size="sm">组名和每档读法由调用方本地化。</Text>
    </Space>
  );
}
''',
)
write(
    "showcase/demos/core/rate/rate-1.tsx",
    '''import { Rate, Space } from "../../../../src/core";

export default function RateCharacterDemo() {
  return (
    <Space orientation="vertical" gap="md">
      <Rate aria-label="优先级" size="small" defaultValue={2} character="●" />
      <Rate aria-label="重要程度" size="large" defaultValue={4} character="◆" />
    </Space>
  );
}
''',
)

# Source-trusted Showcase imports.
replace(
    "showcase/demos/core/data-entry.tsx",
    'import UploadStatesCode from "./upload/states.tsx?raw";\n',
    'import UploadStatesCode from "./upload/states.tsx?raw";\nimport SliderBasicDemo from "./slider/slider-0";\nimport SliderBasicDemoSource from "./slider/slider-0.tsx?raw";\nimport SliderVerticalDemo from "./slider/slider-1";\nimport SliderVerticalDemoSource from "./slider/slider-1.tsx?raw";\nimport RateBasicDemo from "./rate/rate-0";\nimport RateBasicDemoSource from "./rate/rate-0.tsx?raw";\nimport RateCharacterDemo from "./rate/rate-1";\nimport RateCharacterDemoSource from "./rate/rate-1.tsx?raw";\n',
)
replace("showcase/demos/core/data-entry.tsx", "  Rate,\n", "")
replace("showcase/demos/core/data-entry.tsx", "  Slider,\n", "")

old_slider = '''  slider: {
    title: "Slider 滑动输入",
    description: "范围、步长、禁用和键盘调整。",
    code: '<Slider aria-label="音量" min={0} max={100} defaultValue={40} />',
    render: () => (
      <Slider aria-label="音量" min={0} max={100} defaultValue={40} />
    ),
  },
'''
new_slider = '''  slider: {
    title: "Slider 滑动输入",
    description:
      "保持原生 input[type=range] 作为唯一值/键盘/表单语义，补齐 root ref、horizontal/vertical 轴向和 pointer/keyboard 完成回调。7A 不用自绘双 thumb 替换原生单值 Slider。",
    code: SliderBasicDemoSource.replaceAll(
      "../../../../src/core",
      "@gouno/ui/core",
    ),
    render: () => <SliderBasicDemo />,
    demos: [
      {
        title: "垂直方向",
        description: "orientation 只改变轴向呈现；Arrow/Home/End 等键盘行为继续由原生 range 控件拥有。",
        code: SliderVerticalDemoSource.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ),
        render: () => <SliderVerticalDemo />,
      },
    ],
    api: [
      { name: "value", description: "受控原生 range 值。", type: "number | string" },
      { name: "defaultValue", description: "非受控初始值。", type: "number | string" },
      { name: "min / max", description: "原生范围边界。", type: "number | string", defaultValue: "0 / 100" },
      { name: "step", description: "原生值步长。", type: "number | string", defaultValue: "1" },
      { name: "orientation", description: "唯一轴向入口；vertical 使用同一个原生 range 元素。", type: '\"horizontal\" | \"vertical\"', defaultValue: '\"horizontal\"' },
      { name: "disabled", description: "原生禁用状态。", type: "boolean" },
      { name: "onChange", description: "标准原生 range change 事件；不另造第二个 value-change 写入口。", type: "ChangeEventHandler<HTMLInputElement>" },
      { name: "onChangeComplete", description: "pointerup 或 keyup 完成一次调整后的数值回调。", type: "(value: number) => void" },
      { name: "aria-* / input props", description: "透传标准 input、表单、data-* 与 ARIA 属性。", type: "InputHTMLAttributes<HTMLInputElement>" },
      { name: "ref", description: "指向真实 input[type=range]。", type: "Ref<HTMLInputElement>" },
    ],
  },
'''
replace("showcase/demos/core/data-entry.tsx", old_slider, new_slider)

old_rate = '''  rate: {
    title: "Rate 评分",
    description: "受控或非受控星级评分。",
    code: "<Rate defaultValue={3} />",
    render: () => <Rate defaultValue={3} />,
  },
'''
new_rate = '''  rate: {
    title: "Rate 评分",
    description:
      "使用同 name 的原生 radio 作为选择语义，支持受控/非受控、清除、尺寸和自定义字符。Rate 不再注入 Rating / n stars 英文文案；组名和需要本地化的每档名称由调用方通过标准 ARIA/getItemLabel 拥有。",
    code: RateBasicDemoSource.replaceAll(
      "../../../../src/core",
      "@gouno/ui/core",
    ),
    render: () => <RateBasicDemo />,
    demos: [
      {
        title: "尺寸与自定义字符",
        description: "size 复用 small/middle/large；character 只改变视觉字符，不改 radio 语义。",
        code: RateCharacterDemoSource.replaceAll(
          "../../../../src/core",
          "@gouno/ui/core",
        ),
        render: () => <RateCharacterDemo />,
      },
    ],
    api: [
      { name: "value", description: "受控评分；当前 certified scope 为整数档位。", type: "number" },
      { name: "defaultValue", description: "非受控初始评分。", type: "number", defaultValue: "0" },
      { name: "count", description: "评分档位数量。", type: "number", defaultValue: "5" },
      { name: "allowClear", description: "再次点击已选档位时清为 0。", type: "boolean", defaultValue: "true" },
      { name: "disabled", description: "禁用整个原生 radio group。", type: "boolean", defaultValue: "false" },
      { name: "size", description: "复用 Gouno ControlSize。", type: '\"small\" | \"middle\" | \"large\"', defaultValue: '\"middle\"' },
      { name: "name", description: "所有 radio 共用的原生 name；省略时自动生成。", type: "string" },
      { name: "character", description: "视觉字符或按档位渲染字符；不承担 accessible name。", type: "ReactNode | ((value: number) => ReactNode)", defaultValue: '"★"' },
      { name: "getItemLabel", description: "可选的每档本地化 accessible name；省略时使用纯数字。", type: "(value: number) => string" },
      { name: "onChange", description: "评分变化回调。", type: "(value: number) => void" },
      { name: "aria-label / aria-labelledby", description: "canonical 评分组可访问名称，由调用方本地化。", type: "standard ARIA" },
      { name: "label", description: "仅为旧调用保留；新代码使用标准 ARIA。", type: "string", defaultValue: "deprecated" },
      { name: "...div props", description: "透传根 radiogroup div 的标准属性、事件和 data-*。", type: "HTMLAttributes<HTMLDivElement>" },
      { name: "ref", description: "指向真实 radiogroup 根 div。", type: "Ref<HTMLDivElement>" },
    ],
  },
'''
replace("showcase/demos/core/data-entry.tsx", old_rate, new_rate)

# Completion metadata only after this same workflow validates everything together.
replace(
    "showcase/component-progress.ts",
    '  "core-switch",\n',
    '  "core-switch",\n  "core-slider",\n  "core-rate",\n',
)
replace(
    "showcase/catalog.tsx",
    'item("core-slider", "Slider", "滑动输入条", 72, <SlidersHorizontal />)',
    'item("core-slider", "Slider", "滑动输入条", 100, <SlidersHorizontal />)',
)
replace(
    "showcase/catalog.tsx",
    'item("core-rate", "Rate", "评分", 68, <Star />)',
    'item("core-rate", "Rate", "评分", 100, <Star />)',
)
replace(
    "tests/component-progress.test.ts",
    '      "core-switch",\n',
    '      "core-switch",\n      "core-slider",\n      "core-rate",\n',
)

# Update the earlier smoke test so it validates caller-owned standard accessible naming.
replace(
    "tests/core-entry-controls.test.tsx",
    'it("supports rating selection", () => { render(<Rate defaultValue={2} />); fireEvent.click(screen.getByRole("radio", { name: "4 stars" })); expect(screen.getByRole("radio", { name: "4 stars" }).getAttribute("aria-checked")).toBe("true"); });',
    'it("supports rating selection", () => { render(<Rate aria-label="Rating" defaultValue={2} />); fireEvent.click(screen.getByRole("radio", { name: "4" })); expect(screen.getByRole("radio", { name: "4" }).getAttribute("aria-checked")).toBe("true"); });',
)

# Focused behavior, compatibility, accessibility and same-source documentation gates.
write(
    "tests/core-slider-rate-7a.test.tsx",
    '''import { createRef } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Rate, Slider } from "../src/core";
import { dataEntryDocuments } from "../showcase/demos/core/data-entry";

afterEach(cleanup);

describe("Core Slider and Rate 7A", () => {
  it("keeps Slider as a ref-safe native range input", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Slider ref={ref} aria-label="Volume" min={0} max={100} defaultValue={25} />);
    const slider = screen.getByRole("slider", { name: "Volume" });
    expect(ref.current).toBe(slider);
    expect((slider as HTMLInputElement).type).toBe("range");
    expect(slider.getAttribute("aria-orientation")).toBe("horizontal");
  });

  it("adds vertical presentation and composes completion with standard events", () => {
    const onPointerUp = vi.fn();
    const onKeyUp = vi.fn();
    const onChangeComplete = vi.fn();
    render(
      <Slider
        aria-label="Brightness"
        orientation="vertical"
        defaultValue={65}
        onPointerUp={onPointerUp}
        onKeyUp={onKeyUp}
        onChangeComplete={onChangeComplete}
      />,
    );
    const slider = screen.getByRole("slider", { name: "Brightness" }) as HTMLInputElement;
    expect(slider.getAttribute("aria-orientation")).toBe("vertical");
    fireEvent.pointerUp(slider);
    expect(onPointerUp).toHaveBeenCalledTimes(1);
    expect(onChangeComplete).toHaveBeenLastCalledWith(65);
    slider.value = "70";
    fireEvent.keyUp(slider, { key: "ArrowRight" });
    expect(onKeyUp).toHaveBeenCalledTimes(1);
    expect(onChangeComplete).toHaveBeenLastCalledWith(70);
  });

  it("uses caller-owned Rate group/item accessible names instead of injected English copy", () => {
    render(
      <Rate
        aria-label="满意度"
        defaultValue={3}
        getItemLabel={(item) => `${item} 分`}
      />,
    );
    expect(screen.getByRole("radiogroup", { name: "满意度" })).toBeTruthy();
    expect(screen.getByRole("radio", { name: "4 分" })).toBeTruthy();
    expect(screen.queryByRole("radio", { name: "4 stars" })).toBeNull();
  });

  it("supports Rate keyboard movement and allowClear with native radios", () => {
    const onChange = vi.fn();
    render(<Rate aria-label="Priority" defaultValue={2} onChange={onChange} />);
    const two = screen.getByRole("radio", { name: "2" });
    fireEvent.keyDown(two, { key: "ArrowRight" });
    expect(onChange).toHaveBeenLastCalledWith(3);
    const three = screen.getByRole("radio", { name: "3" });
    expect((three as HTMLInputElement).checked).toBe(true);
    fireEvent.click(three);
    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it("keeps controlled Rate caller-owned and preserves label as deprecated fallback", () => {
    const onChange = vi.fn();
    const { rerender } = render(<Rate label="Legacy rating" value={2} onChange={onChange} />);
    expect(screen.getByRole("radiogroup", { name: "Legacy rating" })).toBeTruthy();
    fireEvent.click(screen.getByRole("radio", { name: "4" }));
    expect(onChange).toHaveBeenLastCalledWith(4);
    expect((screen.getByRole("radio", { name: "2" }) as HTMLInputElement).checked).toBe(true);

    rerender(<Rate aria-label="Canonical rating" label="Legacy rating" value={2} />);
    expect(screen.getByRole("radiogroup", { name: "Canonical rating" })).toBeTruthy();
  });

  it("supports canonical Rate sizes/custom characters and root ref", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <Rate ref={ref} aria-label="Priority" size="large" character="◆" defaultValue={1} />,
    );
    expect(ref.current?.dataset.slot).toBe("rate");
    expect(ref.current?.dataset.size).toBe("large");
    expect(container.textContent).toContain("◆");
  });

  it("publishes same-source Slider and Rate demos plus complete API rows", () => {
    expect(dataEntryDocuments.slider.code).toContain('from "@gouno/ui/core"');
    expect(dataEntryDocuments.slider.code).toContain("onChangeComplete");
    expect(dataEntryDocuments.slider.demos?.[0]?.code).toContain('orientation="vertical"');
    expect(dataEntryDocuments.rate.code).toContain("getItemLabel");
    expect(dataEntryDocuments.rate.demos?.[0]?.code).toContain('character="●"');
    expect(dataEntryDocuments.rate.api?.map((row) => row.name)).toEqual(
      expect.arrayContaining(["aria-label / aria-labelledby", "getItemLabel", "label", "ref"]),
    );
  });
});
''',
)
