import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import { ContextMenuItem } from "@/components/primitives/context-menu";
import { MapEditorEventData } from "@/helpers/event-manager";
import { MapText } from "@/types";
import React from "react";

export interface SpotContextMenuItemsProps {
  id: string;
}

export const TextContextMenuItems: React.FC<SpotContextMenuItemsProps> = ({
  id,
}) => {
  const editor = useMapEditor();
  const [text, setText] = React.useState<MapText | undefined>();

  const handleDeleteText = () => {
    if (!text) return;
    editor?.deleteText({
      id: text.id,
    });
  };

  React.useEffect(() => {
    const item = editor?.getItem(id);
    if (!item) return;
    if (!("text" in item)) return;

    setText(item);

    const onSpotUpdated = (event: MapEditorEventData) => {
      if (event.targetType === "text" && event.id === id) {
        const item = editor?.getItem(id);
        if (!item) return;
        if (!("text" in item)) return;
        setText(item);
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
      <ContextMenuItem onClick={handleDeleteText}>Delete text</ContextMenuItem>
    </>
  );
};
