import { EditableLabel } from "@/components/EditableLabel";
import { LayerItem } from "@/components/Layers/LayerItem";
import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import { SvgGroupPreview } from "@/components/SvgGroupPreview";
import { SpotItem } from "@/types";
import React from "react";

export interface LayerSpotItemProps extends React.PropsWithChildren {
  spot: SpotItem;
  indentation?: number;
}

export const LayerSpotItem: React.FC<LayerSpotItemProps> = ({
  spot,
  indentation = 0,
}) => {
  const editor = useMapEditor();

  const handleInputChange = (value: string) => {
    editor?.updateSpot(spot.id, { label: value });
  };

  return (
    <LayerItem
      preview={<SvgGroupPreview targetType={"spot"} targetId={spot.id} />}
      indentation={indentation}
      selectionId={spot.id}
      selectionType={"spot"}
    >
      <div className={"text-muted-foreground text-xs"}>{spot.type}</div>
      <EditableLabel value={spot.label || ""} onChange={handleInputChange} />
    </LayerItem>
  );
};
