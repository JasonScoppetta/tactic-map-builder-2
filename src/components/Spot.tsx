import { SvgSelectionRectangle } from "@/components/SvgSelectionRectangle";
import { mergeRefs } from "@/helpers/mergeRef";
import { useIsSpotSelected } from "@/hooks/useIsSpotSelected";
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
  const isSelected = useIsSpotSelected(spot.id);

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

/*<svg width="94" height="90" viewBox="0 0 94 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="90" height="50" rx="2" transform="matrix(1 0 0 -1 2 50)" fill="#CC00FF" fill-opacity="0.5"/>
    <circle cx="47" cy="58" r="28" fill="#777777" stroke="white" stroke-width="8"/>
    <path
        d="M43.8089 20.512C44.0223 20.512 44.1983 20.5867 44.3369 20.736C44.4863 20.8747 44.5609 21.0507 44.5609 21.264C44.5609 21.4773 44.4863 21.6533 44.3369 21.792C44.1983 21.9307 44.0223 22 43.8089 22H38.1929C37.9583 22 37.7716 21.9307 37.6329 21.792C37.4943 21.6533 37.4249 21.4667 37.4249 21.232C37.4249 21.0187 37.4996 20.8267 37.6489 20.656L41.2169 16.8C41.6756 16.3093 42.0276 15.824 42.2729 15.344C42.5289 14.864 42.6569 14.4427 42.6569 14.08C42.6569 13.4933 42.4809 13.0187 42.1289 12.656C41.7769 12.2933 41.3129 12.112 40.7369 12.112C40.4916 12.112 40.2409 12.1707 39.9849 12.288C39.7396 12.3947 39.5049 12.544 39.2809 12.736C39.0676 12.9173 38.8809 13.1307 38.7209 13.376C38.6143 13.5253 38.5076 13.6213 38.4009 13.664C38.2943 13.7067 38.1929 13.728 38.0969 13.728C37.8943 13.728 37.7076 13.6587 37.5369 13.52C37.3769 13.3707 37.2969 13.2 37.2969 13.008C37.2969 12.8587 37.3449 12.7147 37.4409 12.576C37.5369 12.4373 37.6596 12.2933 37.8089 12.144C38.0436 11.856 38.3263 11.6 38.6569 11.376C38.9983 11.1413 39.3556 10.96 39.7289 10.832C40.1023 10.704 40.4703 10.64 40.8329 10.64C41.5369 10.64 42.1449 10.7787 42.6569 11.056C43.1796 11.3333 43.5796 11.7227 43.8569 12.224C44.1449 12.7253 44.2889 13.3173 44.2889 14C44.2889 14.576 44.1129 15.216 43.7609 15.92C43.4196 16.6133 42.9396 17.296 42.3209 17.968L39.8409 20.672L39.6649 20.512H43.8089ZM51.0482 10.608C51.6455 10.608 52.1735 10.7253 52.6322 10.96C53.1015 11.1947 53.4909 11.5147 53.8002 11.92C54.1202 12.3147 54.3602 12.768 54.5202 13.28C54.6909 13.7813 54.7762 14.304 54.7762 14.848C54.7762 15.264 54.7282 15.744 54.6322 16.288C54.5362 16.8213 54.3762 17.3813 54.1522 17.968C53.9282 18.5547 53.6295 19.12 53.2562 19.664C52.8935 20.208 52.4349 20.6987 51.8802 21.136C51.3362 21.5627 50.6855 21.8933 49.9282 22.128C49.8215 22.1493 49.7202 22.16 49.6242 22.16C49.4109 22.16 49.2189 22.1013 49.0482 21.984C48.8882 21.8667 48.8082 21.6747 48.8082 21.408C48.8082 21.2053 48.8722 21.0347 49.0002 20.896C49.1282 20.7573 49.2989 20.656 49.5122 20.592C50.0349 20.4 50.5469 20.1067 51.0482 19.712C51.5495 19.3067 51.9815 18.832 52.3442 18.288C52.7069 17.7333 52.9522 17.1413 53.0802 16.512L53.4802 16.448C53.3202 16.672 53.1175 16.9013 52.8722 17.136C52.6269 17.3707 52.3335 17.568 51.9922 17.728C51.6509 17.8773 51.2562 17.952 50.8082 17.952C50.1149 17.952 49.5122 17.7973 49.0002 17.488C48.4882 17.168 48.0935 16.7307 47.8162 16.176C47.5389 15.6213 47.4002 14.9867 47.4002 14.272C47.4002 13.6107 47.5602 13.0027 47.8802 12.448C48.2109 11.8933 48.6482 11.4507 49.1922 11.12C49.7469 10.7787 50.3655 10.608 51.0482 10.608ZM51.0642 12.08C50.6695 12.08 50.3175 12.176 50.0082 12.368C49.6989 12.56 49.4535 12.8213 49.2722 13.152C49.0909 13.4827 49.0002 13.856 49.0002 14.272C49.0002 14.688 49.0802 15.0667 49.2402 15.408C49.4002 15.7387 49.6349 16 49.9442 16.192C50.2535 16.384 50.6162 16.48 51.0322 16.48C51.4482 16.48 51.8162 16.384 52.1362 16.192C52.4562 15.9893 52.7069 15.7173 52.8882 15.376C53.0695 15.0347 53.1602 14.6613 53.1602 14.256C53.1602 13.8507 53.0695 13.488 52.8882 13.168C52.7069 12.8373 52.4615 12.576 52.1522 12.384C51.8429 12.1813 51.4802 12.08 51.0642 12.08Z"
        fill="#444444"/>
</svg>*/
