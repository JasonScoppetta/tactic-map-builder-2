import { EditableLabel } from "@/components/EditableLabel";
import { LayerItem } from "@/components/Layers/LayerItem";
import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
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
  const editor = useMapEditor();

  const handleInputChange = (value: string) => {
    editor?.updateText(text.id, { text: value });
  };

  return (
    <LayerItem
      preview={<SvgGroupPreview targetType={"text"} targetId={text.id} />}
      indentation={indentation}
      selectionId={text.id}
      selectionType={"text"}
    >
      <EditableLabel value={text.text || ""} onChange={handleInputChange} />
    </LayerItem>
  );
};
