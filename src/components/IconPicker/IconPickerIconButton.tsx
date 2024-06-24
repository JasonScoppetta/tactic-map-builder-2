import { IconFromSet } from "@/components/IconFromSet";
import React from "react";
import { IconPickerIconButtonProps } from "./IconPicker.types";

const classes = {
  IconName: "text-xs w-full pt-2 text-center break-words",
  IconButton:
    "flex flex-col items-center max-w-[82px] rounded p-2 hover:bg-accent hover:cursor-pointer",
};

export const IconPickerIconButton: React.FC<IconPickerIconButtonProps> = ({
  icon,
  iconName,
  onClick,
  iconSet,
}) => {
  return (
    <div className={classes.IconButton} onClick={onClick}>
      <IconFromSet icon={{ icon, set: iconSet }} />
      <div className={classes.IconName}>{iconName}</div>
    </div>
  );
};
