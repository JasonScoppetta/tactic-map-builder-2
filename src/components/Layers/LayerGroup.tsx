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
          "whitespace-nowrap text-ellipsis border-b border-input bg-primary-background py-1"
        }
        style={{ paddingLeft: indentation * 16 }}
      >
        {title}
      </div>
      {children}
    </div>
  );
};
