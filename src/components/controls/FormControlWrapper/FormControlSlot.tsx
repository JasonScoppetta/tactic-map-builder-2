import { cn } from "@/helpers/cn";
import React from "react";
import { FormControlSlotProps } from "./FormControlWrapper.types";

export const FormControlSlot: React.FC<FormControlSlotProps> = (props) => {
  const { children, ...rest } = props;
  return (
    <div {...rest} className={cn("flex", rest.className)}>
      {children}
    </div>
  );
};
