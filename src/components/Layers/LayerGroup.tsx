import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/helpers/cn";
import { SelectionTargetType } from "@/types";
import { useGesture } from "@use-gesture/react";
import React from "react";

export interface LayerGroupProps extends React.PropsWithChildren {
  indentation?: number;
  title?: string;
  isRoot?: boolean;
  selectionId?: string;
  selectionType?: SelectionTargetType;
}

export const LayerGroup: React.FC<LayerGroupProps> = ({
  children,
  title,
  indentation = 0,
  isRoot,
  selectionId,
  selectionType,
}) => {
  const editor = useMapEditor();
  const bindEvents = useGesture(
    {
      onClick: ({ event }) => {
        event.stopPropagation();
        if (!selectionType || !selectionId) return;
        editor?.updateSelection(selectionId, selectionType, {
          appendSelection: event.metaKey,
        });
      },
    },
    {},
  );

  return (
    <div className={cn("overflow-hidden")}>
      <div
        className={cn(
          "flex justify-between border-b border-input bg-primary-background items-stretch",
          isRoot && "bg-secondary",
          editor?.isItemSelected(selectionId) &&
            "bg-primary text-primary-foreground",
        )}
        style={{ paddingLeft: 10 + indentation * 16 }}
      >
        <div
          className={
            "whitespace-nowrap text-ellipsis flex-grow overflow-hidden select-none py-1"
          }
          {...bindEvents()}
        >
          {title}
        </div>
        <div className={"flex h-full"}>
          <Button
            variant={"ghost"}
            icon={"Plus"}
            className={"h-full rounded-none px-2"}
          />
        </div>
      </div>
      {children}
    </div>
  );
};
