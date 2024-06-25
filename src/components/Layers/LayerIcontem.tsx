import { LayerItem } from "@/components/Layers/LayerItem";
import { SvgGroupPreview } from "@/components/SvgGroupPreview";
import { MapIcon } from "@/types";
import React from "react";

export interface LayerIconItemProps extends React.PropsWithChildren {
  icon: MapIcon;
  indentation?: number;
}

export const LayerIconItem: React.FC<LayerIconItemProps> = ({
  icon,
  indentation = 0,
}) => {
  return (
    <LayerItem
      preview={<SvgGroupPreview targetType={"icon"} targetId={icon.id} />}
      indentation={indentation}
      selectionId={icon.id}
      selectionType={"icon"}
    >
      <div>{icon.icon.icon}</div>
    </LayerItem>
  );
};
