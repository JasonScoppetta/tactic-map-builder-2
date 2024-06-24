import { useEditorItemGestures } from "@/hooks/useEditorItemGestures";
import { SvgSelectionRectangle } from "@/components/SvgSelectionRectangle";
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
    const editorActions = useEditorItemGestures({ ...group, type: "group" });
    const groupRef = React.useRef<SVGGElement | null>(null);

    const rotation = React.useMemo(() => {
      if (!group.rotation || !groupRef.current) return "";

      const offsetX = 0;
      const offsetY = 0;

      const bbox = groupRef.current.getBBox();
      const cx = bbox.x + bbox.width / 2 + offsetX;
      const cy = bbox.y + bbox.height / 2 + offsetY;

      return `${group.rotation} ${cx} ${cy}`;
    }, [group.rotation, groupRef.current]);

    return (
      <g
        className={cn(`map-group`, "spot-group touch-none")}
        data-group-id={group.id}
        ref={mergeRefs([groupRef, ref])}
        transform={`translate(${group.x}, ${group.y})${rotation ? ` rotate(${rotation})` : ""}`}
        {...editorActions?.bindListeners()}
        //onClick={rotate}
        //style={{ transformOrigin: "center center" }}
      >
        <SvgSelectionRectangle
          isSelected={editorActions?.isSelected || false}
          targetRef={groupRef.current}
          updateEventId={group.id}
        />
        {children}
      </g>
    );
  },
);
