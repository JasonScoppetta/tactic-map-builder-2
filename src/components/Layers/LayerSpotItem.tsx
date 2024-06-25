import { LayerItem } from "@/components/Layers/LayerItem";
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
  return (
    <LayerItem
      preview={<SvgGroupPreview targetType={"spot"} targetId={spot.id} />}
      indentation={indentation}
    >
      <div className={"text-muted-foreground text-xs"}>{spot.type}</div>
      <div>{spot.label}</div>
    </LayerItem>
  );
};
