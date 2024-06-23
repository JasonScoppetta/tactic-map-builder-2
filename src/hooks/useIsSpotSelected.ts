import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";

export const useIsSpotSelected = (groupId: string) => {
  const editor = useMapEditor();
  return editor?.selection?.[groupId] === "spot";
};
