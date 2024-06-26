import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import { ContextMenuItem } from "@/components/primitives/context-menu";
import { MapEditorEventData } from "@/helpers/event-manager";
import { MapIcon } from "@/types";
import React from "react";

export interface SpotContextMenuItemsProps {
  id: string;
}

export const IconContextMenuItems: React.FC<SpotContextMenuItemsProps> = ({
  id,
}) => {
  const editor = useMapEditor();
  const [icon, setIcon] = React.useState<MapIcon | undefined>();

  const handleDeleteIcon = () => {
    if (!icon) return;
    editor?.deleteIcon({
      id: icon.id,
    });
  };

  React.useEffect(() => {
    const item = editor?.getItem(id);
    if (!item) return;
    if (!("icon" in item)) return;

    setIcon(item);

    const onSpotUpdated = (event: MapEditorEventData) => {
      if (event.targetType === "icon" && event.id === id) {
        const item = editor?.getItem(id);
        if (!item) return;
        if (!("icon" in item)) return;
        setIcon(item);
      }
    };

    editor?.events?.addListener(id, "update", onSpotUpdated);

    return () => {
      editor?.events?.removeListener(id, "update", onSpotUpdated);
    };
  }, []);

  //const attributes = spot ? getSpotAttributes(spot) : undefined;

  return (
    <>
      <ContextMenuItem onClick={handleDeleteIcon}>Delete icon</ContextMenuItem>
    </>
  );
};
