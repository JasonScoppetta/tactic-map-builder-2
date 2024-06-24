import { Icon } from "@/components/primitives/Icon";
import { IconName } from "@/components/primitives/Icon/Icon.types";
import { IconValue } from "@/types";
import React from "react";

export const IconFromSet: React.FC<{
  icon: IconValue | null;
  size?: number;
  color?: string;
}> = ({ icon, size = 8, color }) => {
  if (!icon) return null;

  const { icon: iconName, set } = icon;
  if (set === "mdi") return null; //return <MdiIcon path={mdiIcons[iconName]} size={size / 5} />;
  if (set === "lucide")
    return <Icon name={iconName as IconName} size={size} color={color} />;
  //if (set === "custom") return <CustomIcon id={iconName} size={size * 4} />;
  return null;
};
