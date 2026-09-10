import { Carousel } from "../../../../src/core";

export default function CarouselEffectsExample() {
  return (
    <Carousel
      effect="fade"
      dotPlacement="top"
      autoplay={{ dotDuration: true }}
      autoplaySpeed={4000}
      pauseOnHover
      items={[
        <div key="alpha" className="min-h-48 bg-muted p-8">Alpha</div>,
        <div key="beta" className="min-h-48 bg-muted p-8">Beta</div>,
        <div key="gamma" className="min-h-48 bg-muted p-8">Gamma</div>,
      ]}
    />
  );
}
