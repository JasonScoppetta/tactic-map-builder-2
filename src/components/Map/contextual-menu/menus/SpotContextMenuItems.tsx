import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import {
  ContextMenuCheckboxItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/components/primitives/context-menu";
import { MapEditorEventData } from "@/helpers/event-manager";
import { SpotItem, SpotType } from "@/types";
import React from "react";

export interface SpotContextMenuItemsProps {
  id: string;
}

export const SpotContextMenuItems: React.FC<SpotContextMenuItemsProps> = ({
  id,
}) => {
  const editor = useMapEditor();
  const [spot, setSpot] = React.useState<SpotItem | undefined>();

  const handleSetType = (type: SpotType) => {
    editor?.updateSpot(id, { type: type });
  };

  React.useEffect(() => {
    setSpot(editor?.getSpot(id));

    const onSpotUpdated = (event: MapEditorEventData) => {
      if (event.targetType === "spot" && event.id === id) {
        setSpot(event.spot);
      }
    };

    editor?.events?.addListener(id, "update", onSpotUpdated);

    return () => {
      editor?.events?.removeListener(id, "update", onSpotUpdated);
    };
  }, []);

  return (
    <>
      <ContextMenuSub>
        <ContextMenuSubTrigger>Change type</ContextMenuSubTrigger>
        <ContextMenuSubContent>
          <ContextMenuCheckboxItem
            checked={spot?.type === "Desk"}
            onClick={handleSetType.bind(null, "Desk")}
          >
            Desk
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={spot?.type === "Empty"}
            onClick={handleSetType.bind(null, "Empty")}
          >
            Empty
          </ContextMenuCheckboxItem>
        </ContextMenuSubContent>
      </ContextMenuSub>
    </>
  );
};
