import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";

export const useIsTextSelected = (textId: string) => {
  const editor = useMapEditor();
  return editor?.selection?.[textId] === "text";
};
