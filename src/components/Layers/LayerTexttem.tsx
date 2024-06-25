import { LayerItem } from "@/components/Layers/LayerItem";
import { SvgGroupPreview } from "@/components/SvgGroupPreview";
import { MapText } from "@/types";
import React from "react";

export interface LayerTextItemProps extends React.PropsWithChildren {
  text: MapText;
  indentation?: number;
}

export const LayerTextItem: React.FC<LayerTextItemProps> = ({
  text,
  indentation = 0,
}) => {
  return (
    <LayerItem
      preview={<SvgGroupPreview targetType={"text"} targetId={text.id} />}
      indentation={indentation}
    >
      <div>{text.text}</div>
    </LayerItem>
  );
};
