import React from "react";

interface LayerItemProps extends React.PropsWithChildren {
  preview?: React.ReactNode;
  indentation?: number;
}

export const LayerItem: React.FC<LayerItemProps> = (props) => {
  const { preview, indentation = 0, children } = props;
  return (
    <div
      className={
        "border-b border-input select-none flex gap-2 items-center py-1"
      }
      style={{ paddingLeft: 10 + indentation * 16 }}
    >
      {preview}
      <div className={"w-full flex gap-2 items-center"}>{children}</div>
    </div>
  );
};
