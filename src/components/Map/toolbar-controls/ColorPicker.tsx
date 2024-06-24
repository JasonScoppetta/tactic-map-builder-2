import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/primitives/popover";
import { ToolBarControlFC } from "@/types";
import Sketch from "@uiw/react-color-sketch";

export const ColorPicker: ToolBarControlFC = ({ onChange, value }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>COLOR {String(value)}</button>
      </PopoverTrigger>
      <PopoverContent>
        <Sketch
          style={{ marginLeft: 20 }}
          color={String(value)}
          onChange={(color) => {
            onChange(color.hex);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
