import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/select";
import { ToolBarControlFC } from "@/types";

const sizes = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 18, 20, 24, 36, 48, 64, 72,
  96, 144, 288,
];

export const GapSelect: ToolBarControlFC = ({ onChange, value }) => {
  return (
    <Select
      onValueChange={(value) => onChange(Number(value))}
      value={String(value)}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {sizes.map((size) => (
          <SelectItem key={size} value={String(size)}>
            {size}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
