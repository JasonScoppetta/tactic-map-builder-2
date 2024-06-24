import React from "react";

export interface SvgSelectionRectangleProps {
  isSelected: boolean;
  targetRef: SVGGElement | null;
}

export const SvgSelectionRectangle: React.FC<SvgSelectionRectangleProps> = ({
  isSelected,
  targetRef,
}) => {
  const [selectBoxRef, setSelectBoxRef] = React.useState<SVGRectElement | null>(
    null,
  );

  React.useEffect(() => {
    if (!isSelected) {
      setSelectBoxRef(null);
      return;
    }

    if (!selectBoxRef) return;
    const groupSize = targetRef?.getBBox();

    selectBoxRef.setAttribute("width", String(groupSize?.width || 0));
    selectBoxRef.setAttribute("height", String(groupSize?.height || 0));
  }, [isSelected, selectBoxRef, targetRef]);

  if (!isSelected) return null;

  return (
    <rect
      ref={setSelectBoxRef}
      width={10}
      height={10}
      x={0}
      y={0}
      className={"selection-rectangle fill-primary/50 stroke-primary stroke-2"}
    />
  );
};
