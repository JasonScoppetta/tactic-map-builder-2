import { Layers } from "@/components/Layers/Layers";
import { MapEditorContextualMenu } from "@/components/Map/contextual-menu/MapEditorContextualMenu";
import { Map } from "@/components/Map/Map";
import { MapEditorTools } from "@/components/Map/MapEditorTools";
import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import { cn } from "@/helpers/cn";
import React from "react";

export const EditorViews: React.FC = () => {
  const editor = useMapEditor();
  const [containerRef, setContainerRef] =
    React.useState<HTMLDivElement | null>();

  //const [areaSize, setAreaSize] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    const updateSize = () => {
      if (!containerRef) return;
      editor?.setAreaSize(containerRef.clientWidth, containerRef.clientHeight);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [containerRef, editor?.viewMode]);

  const isResourcesMode = editor?.viewMode === "resources";

  return (
    <div
      className={cn("grid h-screen grid-rows-[60px,1fr] grid-cols-[360px,1fr]")}
    >
      <div
        className={"flex w-full border-b border-input shadow-md relative"}
        style={{ gridRow: "1 / 2", gridColumn: "1 / -1" }}
      >
        <MapEditorTools />
      </div>
      {isResourcesMode && (
        <div
          className={"bg-muted overflow-auto"}
          style={{ gridRow: "2 / -1", gridColumn: "1 / 2" }}
        >
          <Layers />
        </div>
      )}
      <div
        className={cn("overflow-hidden")}
        style={{
          gridRow: "2 / -1",
          gridColumn: isResourcesMode ? "2 / -1" : "1 / -1",
        }}
        ref={setContainerRef}
      >
        <MapEditorContextualMenu>
          <Map />
        </MapEditorContextualMenu>
      </div>
    </div>
  );
};
