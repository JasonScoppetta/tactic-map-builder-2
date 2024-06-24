import { SelectionTarget } from "@/types";

export const getItemLabel = (item: SelectionTarget | undefined) => {
  if (!item) return "";

  if ("label" in item) return item.label;
  if ("text" in item) return item.text;

  return "";
};
