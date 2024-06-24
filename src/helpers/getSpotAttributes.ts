import { SpotAttributes, SpotGroup, SpotItem, SpotRow } from "@/types";

export interface GetSpotAttributesOptions {
  spot: SpotItem;
  row: SpotRow;
  group: SpotGroup;
}

export function getSpotAttributes(
  options: GetSpotAttributesOptions,
): SpotAttributes {
  return {
    ...options.spot,
    color: options.spot.color || options.row.color || options.group.color,
    orientation:
      options.spot.orientation ||
      options.row.orientation ||
      options.group.orientation,
    textColor:
      options.spot.textColor ||
      options.row.textColor ||
      options.group.textColor,
  };
}
