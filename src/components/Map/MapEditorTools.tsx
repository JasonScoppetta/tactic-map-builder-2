import { useEditorSelectionBoundingRect } from "@/hooks/useEditorSelectionBoundingRect";

export const MapEditorTools = () => {
  const selectionRect = useEditorSelectionBoundingRect();
  return (
    <div
      className={"absolute z-sticky p-4 bg-primary"}
      style={{
        top: selectionRect?.y,
        left: selectionRect?.x + selectionRect?.width,
      }}
    >
      MapEditorTools
    </div>
  );
};
