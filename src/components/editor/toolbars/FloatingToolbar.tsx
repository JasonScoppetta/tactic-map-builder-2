import React from "react";
import { MainMouseTool, ViewMode } from "@/types";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/primitives/toggle-group";
import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";

export const FloatingToolbar: React.FC = () => {
  const editor = useMapEditor();

  return (
    <div
      className={
        "absolute bottom-10 left-1/2 z-sticky shadow-xl bg-primary-background rounded-lg overflow-hidden"
      }
    >
      <ToggleGroup
        type={"single"}
        value={editor?.selectedMainTool}
        onValueChange={(value) =>
          !!value && editor?.setMainMouseTool(value as MainMouseTool)
        }
      >
        <ToggleGroupItem
          value={"select"}
          icon={{ set: "lucide", icon: "BoxSelect" }}
        />
        <ToggleGroupItem
          value={"moveMap"}
          icon={{ set: "lucide", icon: "Move" }}
        />
      </ToggleGroup>
    </div>
  );
};
