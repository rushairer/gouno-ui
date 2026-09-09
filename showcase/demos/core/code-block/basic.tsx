import { CodeBlock } from "../../../../src/core";

const sample = `type Session = {
  userID: string;
  expiresAt: number;
};

export function isActive(session: Session) {
  return session.expiresAt > Date.now();
}`;

export default function CodeBlockBasicDemo() {
  return <CodeBlock code={sample} language="tsx" />;
}
