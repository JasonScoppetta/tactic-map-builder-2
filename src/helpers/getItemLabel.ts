import { SelectionTarget } from "@/types";

export const getItemLabel = (item: SelectionTarget | undefined) => {
  if (!item) return "";

  if ("label" in item) return item.label;
  if ("text" in item) return item.text;
  if ("icon" in item) return item.icon.icon;

  return "";
};
