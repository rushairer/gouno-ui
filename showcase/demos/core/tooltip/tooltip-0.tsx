import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../src/core";

export default function TooltipExample() {
  return (
    <div className="flex min-h-32 items-center justify-center">
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>聚焦或悬停</Button>
          </TooltipTrigger>
          <TooltipContent placement="bottom-start" offset={6}>
            补充说明
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
