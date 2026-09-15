import { useEffect } from "react";
import {
  useNotification,
  type NotificationNotice,
} from "../../../../src/core";

export type FixtureNotice = {
  type?: NotificationNotice["type"];
  message?: string;
  text?: string;
} | null;

export function FixtureNotification({
  notice,
  onConsumed,
}: {
  notice: FixtureNotice;
  onConsumed: () => void;
}) {
  const { open } = useNotification();
  const message = notice?.message ?? notice?.text;
  const type = notice?.type;

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
