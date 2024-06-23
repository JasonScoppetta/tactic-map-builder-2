import { Spot } from "@/components/Spot";
import React from "react";

export const LayerItem: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className={"border-b select-none"}>
      <svg></svg>
    </div>
  );
};
