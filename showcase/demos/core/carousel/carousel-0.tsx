import { Carousel } from "../../../../src/core";

const slides = [
  { title: "Core API", description: "公共契约先稳定，再进入真实产品。" },
  { title: "Showcase", description: "Preview 与示例代码来自同一份 TSX。" },
  { title: "Quality Gate", description: "类型、测试、构建与 Pages 全部通过。" },
];

export default function CarouselBasicExample() {
  return (
    <Carousel
      arrows
      draggable
      items={slides.map((slide) => (
        <div key={slide.title} className="min-h-56 bg-muted p-8">
          <h3 className="text-lg font-semibold">{slide.title}</h3>
          <p className="mt-2 text-muted-foreground">{slide.description}</p>
        </div>
      ))}
    />
  );
}
