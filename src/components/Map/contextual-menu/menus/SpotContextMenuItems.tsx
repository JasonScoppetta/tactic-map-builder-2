import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import {
  ContextMenuCheckboxItem,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/components/primitives/context-menu";
import { MapEditorEventData } from "@/helpers/event-manager";
import { getEnumKeys } from "@/helpers/getObjectKeys";
import { GetSpotReturn, Orientation, SpotType, SpotTypes } from "@/types";
import React from "react";

export interface SpotContextMenuItemsProps {
  id: string;
}

export const SpotContextMenuItems: React.FC<SpotContextMenuItemsProps> = ({
  id,
}) => {
  const editor = useMapEditor();
  const [spot, setSpot] = React.useState<GetSpotReturn | undefined>();

  const handleSetType = (type: SpotType | undefined) => {
    editor?.updateSpot(id, { type });
  };

  const handleSetOrientation = (orientation: Orientation | undefined) => {
    editor?.updateSpot(id, { orientation });
  };

  const handleDeleteSpot = () => {
    if (!spot) return;
    editor?.deleteSpot({
      spotId: spot.spot.id,
      groupId: spot.group.id,
      rowId: spot.row.id,
    });
  };

  const handleDeleteRow = () => {
    if (!spot) return;
    editor?.deleteRow({
      rowId: spot.row.id,
      groupId: spot.group.id,
    });
  };

  const handleDeleteGroup = () => {
    if (!spot) return;
    editor?.deleteGroup({
      groupId: spot.group.id,
    });
  };

  const handleDuplicateLine = () => {
    if (!spot) return;
    const row = editor?.getItem(spot.row.id);
    if (!row) return;
    if (!("items" in row)) return;

    const newRow = editor?.addRow({
      groupId: spot.group.id,
    });

    if (!newRow) return;
    editor?.updateRow(newRow.id, {
      ...newRow,
      ...row,
      id: newRow.id,
    });
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
            checked={!spot?.spot?.type}
            onClick={handleSetType.bind(null, undefined)}
          >
            Inherit
          </ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          {getEnumKeys(SpotTypes).map((type) => (
            <ContextMenuCheckboxItem
              key={type}
              checked={spot?.spot?.type === type}
              onClick={handleSetType.bind(null, type as SpotType)}
            >
              {type}
            </ContextMenuCheckboxItem>
          ))}
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
      <ContextMenuSeparator />
      <ContextMenuItem onClick={handleDuplicateLine}>
        Duplicate line
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={handleDeleteSpot}>Delete spot</ContextMenuItem>
      <ContextMenuItem onClick={handleDeleteRow}>Delete row</ContextMenuItem>
      <ContextMenuItem onClick={handleDeleteGroup}>
        Delete group
      </ContextMenuItem>
    </>
  );
};
