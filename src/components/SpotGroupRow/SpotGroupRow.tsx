import { SpotRow } from "@/types";
import React from "react";
import { Spot } from "../Spot";

export interface SpotGroupRowProps {
  row: SpotRow;
  rowIndex: number;
}

export const SpotGroupRow = React.forwardRef<SVGSVGElement, SpotGroupRowProps>(
  function (props, ref) {
    const { row, rowIndex } = props;
    return (
      <g ref={ref}>
        {row.items.map((item, itemIndex) => (
          <Spot
            key={item.id}
            x={itemIndex}
            y={rowIndex}
            orientation={row.orientation}
            paddingX={item.paddingX}
            paddingY={item.paddingY}
          />
        ))}
      </g>
    );
  },
);
