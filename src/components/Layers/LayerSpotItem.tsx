import { SpotItem } from "@/types";
import React from "react";

export interface LayerSpotItemProps extends React.PropsWithChildren {
  spot: SpotItem;
  indentation?: number;
}

const layerPreviewWidth = 32;
const layerPreviewHeight = 32;

export const LayerSpotItem: React.FC<LayerSpotItemProps> = ({
  spot,
  indentation = 0,
}) => {
  const layerPreviewGroupRef = React.useRef<SVGSVGElement>(null);
  const spotElement = document.querySelector(`[data-spot-id="${spot.id}"]`);
  React.useEffect(() => {
    if (!spotElement || !layerPreviewGroupRef.current) {
      return;
    }

    layerPreviewGroupRef.current.innerHTML = spotElement.innerHTML;

    const layerPreviewRect = layerPreviewGroupRef.current.getBBox();

    console.log(layerPreviewRect);

    const newViewBox = [
      0,
      0,
      layerPreviewRect.width,
      layerPreviewRect.height,
    ].join(" ");

    (layerPreviewGroupRef.current.parentNode as SVGSVGElement)?.setAttribute(
      "viewBox",
      newViewBox,
    );
  }, [spotElement, layerPreviewGroupRef.current]);

  return (
    <div
      className={
        "border-b border-input select-none flex gap-2 items-center py-1"
      }
      style={{ paddingLeft: 10 + indentation * 16 }}
    >
      <div
        className={
          "flex border border-secondary bg-primary-background overflow-hidden rounded-sm flex-shrink-0"
        }
        style={{ width: layerPreviewWidth }}
      >
        <svg
          viewBox={`0 0 ${layerPreviewWidth} ${layerPreviewHeight}`}
          height={layerPreviewWidth}
          width={layerPreviewHeight}
        >
          <g ref={layerPreviewGroupRef}></g>
        </svg>
      </div>
      <div className={"w-full flex gap-2 items-center"}>
        <div className={"text-muted-foreground text-xs"}>{spot.type}</div>
        <div>{spot.label}</div>
      </div>
    </div>
  );
};
