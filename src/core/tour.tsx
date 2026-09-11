import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/primitives/dialog";
import { Button } from "./button";
import { cn } from "../lib/utils";

export interface TourStep {
  title: ReactNode;
  description?: ReactNode;
}

export interface TourProps {
  open: boolean;
  steps: readonly TourStep[];
  current?: number;
  onChange?: (current: number) => void;
  onClose: () => void;
  previousText: string;
  nextText: string;
  finishText: string;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

function normalizeIndex(index: number, length: number) {
  if (length <= 0 || !Number.isFinite(index)) return 0;
  return Math.min(Math.max(Math.trunc(index), 0), length - 1);
}

export function Tour({
  open,
  steps,
  current,
  onChange,
  onClose,
  previousText,
  nextText,
  finishText,
  className,
  ref,
}: TourProps) {
  const [innerCurrent, setInnerCurrent] = useState(0);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const controlled = current !== undefined;
  const index = normalizeIndex(controlled ? current : innerCurrent, steps.length);
  const step = steps[index];

  useEffect(() => {
    if (!open && !controlled) setInnerCurrent(0);
  }, [controlled, open]);

  const moveTo = (nextIndex: number) => {
    const normalized = normalizeIndex(nextIndex, steps.length);
    if (!controlled) setInnerCurrent(normalized);
    onChange?.(normalized);
  };

  const finish = () => {
    if (!controlled) setInnerCurrent(0);
    onClose();
  };

  if (!open || !step) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent
        ref={ref}
        showCloseButton={false}
        data-slot="tour-content"
        data-step-index={index}
        onPointerDownOutside={(event) => event.preventDefault()}
        onOpenAutoFocus={() => {
          const activeElement = document.activeElement;
          restoreFocusRef.current =
            activeElement instanceof HTMLElement && activeElement !== document.body
              ? activeElement
              : null;
        }}
        onCloseAutoFocus={(event) => {
          const restoreFocusTarget = restoreFocusRef.current;
          restoreFocusRef.current = null;
          if (!restoreFocusTarget?.isConnected) return;
          event.preventDefault();
          restoreFocusTarget.focus();
        }}
        className={cn(
          "top-auto bottom-6 left-1/2 w-80 max-w-[calc(100vw-2rem)] -translate-x-1/2 translate-y-0 sm:max-w-[calc(100vw-2rem)]",
          className,
        )}
      >
        <DialogHeader>
          <DialogTitle>{step.title}</DialogTitle>
          {step.description ? (
            <DialogDescription>{step.description}</DialogDescription>
          ) : null}
        </DialogHeader>

        <div className="text-xs text-muted-foreground" data-slot="tour-progress">
          {index + 1} / {steps.length}
        </div>

        <DialogFooter>
          {index > 0 ? (
            <Button size="small" onClick={() => moveTo(index - 1)}>
              {previousText}
            </Button>
          ) : null}
          {index < steps.length - 1 ? (
            <Button
              size="small"
              variant="solid"
              color="primary"
              onClick={() => moveTo(index + 1)}
            >
              {nextText}
            </Button>
          ) : (
            <Button
              size="small"
              variant="solid"
              color="primary"
              onClick={finish}
            >
              {finishText}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
