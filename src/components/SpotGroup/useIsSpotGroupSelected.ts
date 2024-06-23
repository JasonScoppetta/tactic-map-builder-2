import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";

export const useIsSpotGroupSelected = (groupId: string) => {
  const editor = useMapEditor();
  return !!editor?.selectedGroups?.[groupId];
};
