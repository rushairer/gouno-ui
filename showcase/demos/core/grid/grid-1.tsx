import { Card, Col, Row } from "../../../../src/core";

export default function ResponsiveGridDemo() {
  return (
    <Row gutter={[16, 16]}>
      {[1, 2, 3, 4].map((item) => (
        <Col key={item} xs={24} sm={12} lg={6}><Card padding="sm">Col {item}</Card></Col>
      ))}
    </Row>
  );
}
