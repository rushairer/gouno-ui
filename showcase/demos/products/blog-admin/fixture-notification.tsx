import { useEffect } from "react";
import {
  useNotification,
  type NotificationNotice,
} from "../../../../src/core";

export type FixtureNotice =
  | string
  | {
      type?: NotificationNotice["type"];
      message?: string;
      text?: string;
    }
  | null;

export function FixtureNotification({
  notice,
  onConsumed,
}: {
  notice: FixtureNotice;
  onConsumed: () => void;
}) {
  const { open } = useNotification();
  const message =
    typeof notice === "string" ? notice : notice?.message ?? notice?.text;
  const type = typeof notice === "string" ? "info" : notice?.type;

  useEffect(() => {
    if (!message) return;
    open({
      title: message,
      type,
      closable: { "aria-label": "关闭通知" },
    });
    onConsumed();
  }, [message, onConsumed, open, type]);

  return null;
}
