import { Icon } from "@/components/primitives/Icon";
import { IconName } from "@/components/primitives/Icon/Icon.types";
import { IconValue } from "@/types";
import * as mdiIcons from "@mdi/js";
import React from "react";

export const IconFromSet: React.FC<{
  icon: IconValue | null;
  size?: number;
  color?: string;
}> = ({ icon, size = 8, color }) => {
  if (!icon) return null;

  const { icon: iconName, set } = icon;
  if (set === "mdi")
    return (
      <svg
        viewBox={"0 0 24 24"}
        width={`${size * 4}px`}
        height={`${size * 4}px`}
        fill={"none"}
      >
        <path
          d={mdiIcons[iconName]}
          style={{ fill: color || "currentColor" }}
        />
      </svg>
    );
  if (set === "lucide")
    return <Icon name={iconName as IconName} size={size} color={color} />;
  //if (set === "custom") return <CustomIcon id={iconName} size={size * 4} />;
  return null;
};
