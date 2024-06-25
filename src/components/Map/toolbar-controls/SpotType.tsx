import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/select";
import { getEnumKeys } from "@/helpers/getObjectKeys";
import { SpotTypes, ToolBarControlFC } from "@/types";

export const SpotType: ToolBarControlFC = ({ onChange, value }) => {
  return (
    <Select onValueChange={(value) => onChange(value)} value={String(value)}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {getEnumKeys(SpotTypes).map((type) => (
          <SelectItem key={type} value={String(type)}>
            {type}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
