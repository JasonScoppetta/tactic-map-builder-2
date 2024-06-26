import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/helpers/cn";
import { SelectionTargetType } from "@/types";
import { useGesture } from "@use-gesture/react";
import React from "react";

interface LayerItemProps extends React.PropsWithChildren {
  preview?: React.ReactNode;
  indentation?: number;
  selectionId?: string;
  selectionType?: SelectionTargetType;
}

export const LayerItem: React.FC<LayerItemProps> = (props) => {
  const editor = useMapEditor();
  const {
    preview,
    indentation = 0,
    children,
    selectionId,
    selectionType,
  } = props;

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
    <div
      className={cn(
        "group border-b border-input select-none flex gap-2 items-center py-1",
        editor?.isItemSelected(selectionId) &&
          "bg-primary text-primary-foreground",
      )}
      style={{ paddingLeft: 10 + indentation * 16 }}
      {...bindEvents()}
    >
      {preview}
      <div className={"w-full flex gap-2 items-center"}>{children}</div>
      <div>
        <div className={"hidden group-hover:block"}>
          <Button
            variant={"ghost"}
            icon={"EllipsisVertical"}
            className={"h-full rounded-none px-2"}
          />
        </div>
      </div>
    </div>
  );
};
