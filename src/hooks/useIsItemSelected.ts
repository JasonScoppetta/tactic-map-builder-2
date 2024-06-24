import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import { SelectionTargetType } from "@/types";

export const useIsItemSelected = (id: string, type: SelectionTargetType) => {
  const editor = useMapEditor();
  return editor?.selection?.[id] === type;
};
