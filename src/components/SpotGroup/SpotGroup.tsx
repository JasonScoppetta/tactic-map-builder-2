import { useIsSpotGroupSelected } from "@/components/SpotGroup/useIsSpotGroupSelected";
import { useSpotGroupEditorActions } from "@/components/SpotGroup/useSpotGroupEditorActions";
import { cn } from "@/helpers/cn";
import { mergeRefs } from "@/helpers/mergeRef";
import React from "react";
import { SpotGroup as ISportGroup } from "../../types";

export interface SpotGroupProps extends React.PropsWithChildren {
  group: ISportGroup;
}

export const SpotGroup = React.forwardRef<SVGSVGElement, SpotGroupProps>(
  function (props, ref) {
    const { group, children } = props;
    const editorActions = useSpotGroupEditorActions(group);
    const groupRef = React.useRef<SVGGElement | null>(null);
    const [selectBoxRef, setSelectBoxRef] =
      React.useState<SVGRectElement | null>(null);
    const isSelected = useIsSpotGroupSelected(group.id);

    React.useEffect(() => {
      if (!isSelected) {
        setSelectBoxRef(null);
        return;
      }

      if (!selectBoxRef) return;
      const groupSize = groupRef.current?.getBBox();

      selectBoxRef.setAttribute("width", String(groupSize?.width || 0));
      selectBoxRef.setAttribute("height", String(groupSize?.height || 0));
    }, [isSelected, selectBoxRef, groupRef.current]);

    return (
      <g
        className={cn(`map-group`, "spot-group touch-none")}
        data-group-id={group.id}
        ref={mergeRefs([groupRef, ref])}
        transform={`translate(${group.x}, ${group.y})`}
        {...editorActions?.bindListeners()}
      >
        {isSelected && (
          <rect
            ref={setSelectBoxRef}
            width={10}
            height={10}
            x={0}
            y={0}
            className={"fill-primary/50 stroke-primary stroke-2"}
          />
        )}
        {children}
      </g>
    );
  },
);
