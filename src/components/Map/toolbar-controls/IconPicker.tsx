import { IconFromSet } from "@/components/IconFromSet";
import { IconPicker as IconPickerPicker } from "@/components/IconPicker/IconPicker";
import { Button } from "@/components/primitives/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/primitives/popover";
import { useBooleanState } from "@/hooks/useBooleanState";
import { IconValue, ToolBarControlFC } from "@/types";

const classes = {
  FormControl: "gap-2 items-center",
  PreviewBox:
    "rounded-md border border-primary/60 border-2 h-10 w-10 items-center justify-center",
  EmptySelection: "bg-muted/60",
  PopoverContent: "bg-primary-background p-0 w-[550px]",
  PopoverArrow: "fill-muted",
};

export const IconPicker: ToolBarControlFC = ({ value, onChange }) => {
  const isOpen = useBooleanState();
  const handleSelectIcon = (icon: IconValue) => {
    onChange?.(icon);
    isOpen.false();
    onChange?.(icon);
  };

  return (
    <Popover open={isOpen.state} onOpenChange={isOpen.setState}>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          className={"border border-input transition-none"}
        >
          <IconFromSet
            icon={(value as never) || { set: "lucide", icon: "Circle" }}
            size={6}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        arrowProps={{ className: classes.PopoverArrow }}
        className={classes.PopoverContent}
      >
        <IconPickerPicker onSelect={handleSelectIcon} />
      </PopoverContent>
    </Popover>
  );
};
