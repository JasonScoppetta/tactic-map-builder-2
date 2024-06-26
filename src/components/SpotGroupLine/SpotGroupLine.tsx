import { GroupOrientation, SpotGroup, SpotRow } from "@/types";
import React from "react";
import { Spot } from "../Spot";

export interface SpotGroupLineProps {
  row: SpotRow;
  group: SpotGroup;
  rowIndex: number;
  orientation: GroupOrientation;
  paddingX?: number;
  paddingY?: number;
  spotGapX?: number;
  spotGapY?: number;
}

export const SpotGroupLine = React.forwardRef<
  SVGSVGElement,
  SpotGroupLineProps
>(function (props, ref) {
  const {
    row,
    group,
    rowIndex,
    orientation,
    paddingY,
    paddingX,
    spotGapX,
    spotGapY,
  } = props;

  return (
    <g
      ref={ref}
      data-row-id={row.id}
      transform={`translate(${paddingX},${paddingY})`}
    >
      {row.items.map((item, itemIndex) => (
        <Spot
          key={item.id}
          x={orientation === "horizontal" ? itemIndex : rowIndex}
          y={orientation === "horizontal" ? rowIndex : itemIndex}
          orientation={item.orientation || row.orientation}
          paddingX={(item.paddingX || 0) + (spotGapX || 0)}
          paddingY={(item.paddingY || 0) + (spotGapY || 0)}
          color={item.color || row.color || group.color}
          textColor={item.textColor || row.textColor || group.textColor}
          spot={item}
          label={item.label}
          type={item.type || group.type || "Desk"}
        />
      ))}
    </g>
  );
});
