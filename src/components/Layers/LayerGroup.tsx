import { Button } from "@/components/primitives/Button";
import { cn } from "@/helpers/cn";
import React from "react";

export interface LayerGroupProps extends React.PropsWithChildren {
  indentation?: number;
  title?: string;
}

export const LayerGroup: React.FC<LayerGroupProps> = ({
  children,
  title,
  indentation = 0,
}) => {
  return (
    <div className={cn("overflow-hidden")}>
      <div
        className={
          "flex justify-between border-b border-input bg-primary-background items-stretch"
        }
        style={{ paddingLeft: 10 + indentation * 16 }}
      >
        <div
          className={
            "whitespace-nowrap text-ellipsis flex-grow overflow-hidden select-none py-1"
          }
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
