import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import {
  ContextMenuCheckboxItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/components/primitives/context-menu";
import { MapEditorEventData } from "@/helpers/event-manager";
import { GetSpotReturn, Orientation, SpotType } from "@/types";
import React from "react";

export interface SpotContextMenuItemsProps {
  id: string;
}

export const SpotContextMenuItems: React.FC<SpotContextMenuItemsProps> = ({
  id,
}) => {
  const editor = useMapEditor();
  const [spot, setSpot] = React.useState<GetSpotReturn | undefined>();

  const handleSetType = (type: SpotType) => {
    editor?.updateSpot(id, { type });
  };

  const handleSetOrientation = (orientation: Orientation | undefined) => {
    editor?.updateSpot(id, { orientation });
  };

  React.useEffect(() => {
    setSpot(editor?.getSpot(id));

    const onSpotUpdated = (event: MapEditorEventData) => {
      if (event.targetType === "spot" && event.id === id) {
        setSpot(editor?.getSpot(id));
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
      <ContextMenuSub>
        <ContextMenuSubTrigger>Change type</ContextMenuSubTrigger>
        <ContextMenuSubContent>
          <ContextMenuCheckboxItem
            checked={spot?.spot?.type === "Desk"}
            onClick={handleSetType.bind(null, "Desk")}
          >
            Desk
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={spot?.spot?.type === "Empty"}
            onClick={handleSetType.bind(null, "Empty")}
          >
            Empty
          </ContextMenuCheckboxItem>
        </ContextMenuSubContent>
      </ContextMenuSub>
      <ContextMenuSub>
        <ContextMenuSubTrigger>Change orientation</ContextMenuSubTrigger>
        <ContextMenuSubContent>
          <ContextMenuCheckboxItem
            checked={!spot?.spot?.orientation}
            onClick={handleSetOrientation.bind(null, undefined)}
          >
            Inherit
          </ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem
            checked={spot?.spot?.orientation === "top"}
            onClick={handleSetOrientation.bind(null, "top")}
          >
            Top
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={spot?.spot?.orientation === "bottom"}
            onClick={handleSetOrientation.bind(null, "bottom")}
          >
            Bottom
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={spot?.spot?.orientation === "left"}
            onClick={handleSetOrientation.bind(null, "left")}
          >
            Left
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={spot?.spot?.orientation === "right"}
            onClick={handleSetOrientation.bind(null, "right")}
          >
            Right
          </ContextMenuCheckboxItem>
        </ContextMenuSubContent>
      </ContextMenuSub>
    </>
  );
};
