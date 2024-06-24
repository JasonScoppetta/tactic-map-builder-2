import { SvgSelectionRectangle } from "@/components/SvgSelectionRectangle";
import { mergeRefs } from "@/helpers/mergeRef";
import { useIsEditing } from "@/hooks/useIsEditing";
import { useIsItemSelected } from "@/hooks/useIsItemSelected";
import { Orientation, SpotItem } from "@/types";
import * as React from "react";

const spotWidth = 94;
const spotHeight = 50;

export interface SpotProps {
  x?: number;
  y?: number;
  orientation?: Orientation;
  paddingY?: number;
  paddingX?: number;
  spot: SpotItem;
  color?: string;
  textColor?: string;
  label?: string;
}
export const Spot = React.forwardRef<SVGSVGElement, SpotProps>((props, ref) => {
  const isEditing = useIsEditing();
  const {
    x = 0,
    y = 0,
    orientation = "top",
    paddingY = 1,
    paddingX = 1,
    spot,
    color = "#C0F",
    label,
    textColor,
  } = props;

  const groupRef = React.useRef<SVGGElement | null>(null);

  const isBottom = orientation === "bottom";
  const isRight = orientation === "right";
  const isHorizontal = orientation === "top" || orientation === "bottom";

  const isEmpty = spot.type === "Empty";
  const isSelected = useIsItemSelected(spot.id, "spot");

  let circleCy = 28;
  let circleCx = 47;
  let rectX = 2;
  let rectY = 40;
  let labelX = 45;
  let labelY = 78;
  let fullHeight = 90;

  let rectWidth = spotWidth;
  let rectHeight = spotHeight;

  if (isHorizontal && isBottom) {
    circleCy = 56;
    labelY = 16;
    rectY = 0;
  } else if (!isHorizontal) {
    rectWidth = spotHeight!;
    rectHeight = spotWidth!;

    fullHeight = 94;
    rectY = -4;
    circleCy = 47;
    labelY = 52;
    if (isRight) {
      labelX = 14;
      rectX = 2;
      circleCx = 58;
    } else {
      labelX = 81;
      rectX = 46;
      circleCx = 36;
    }
  }

  return (
    <g
      className={"spot-item"}
      data-spot-id={spot.id}
      ref={mergeRefs([groupRef, ref])}
      transform={`translate(${x * spotWidth + (x > 0 ? paddingX * x : 0)}, ${y * fullHeight + (y > 0 ? paddingY * y : 0)})`}
    >
      <SvgSelectionRectangle
        isSelected={isSelected}
        targetRef={groupRef.current}
      />
      {spot.type === "Desk" && (
        <>
          <rect
            width={rectWidth}
            height={rectHeight}
            x={rectX}
            y={rectY}
            fill={color}
            rx={2}
          />
          <circle
            cx={circleCx}
            cy={circleCy}
            r={28}
            fill="#777"
            stroke="#fff"
            strokeWidth={8}
            className={"hover:fill-primary hover:cursor-pointer"}
          />
        </>
      )}
      {spot.type === "Empty" && isEditing && (
        <>
          <rect
            width={rectWidth}
            height={rectHeight}
            x={rectX}
            y={rectY}
            opacity={0.5}
            fill={color}
            stroke={color}
            strokeWidth={2}
            strokeDasharray="0 4 0"
            rx={2}
          />
        </>
      )}
      {!isEmpty && label && (
        <text
          className={"touch-none select-none"}
          fill={textColor}
          x={labelX}
          y={labelY}
          fontSize="12"
          textAnchor="middle"
        >
          {label}
        </text>
      )}
    </g>
  );
});

Spot.displayName = "Spot";
