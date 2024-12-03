import { MapText } from "@/types";
import { CanvasRenderer } from "./CanvasRenderer";

export class CanvasText {
  static draw(ctx: CanvasRenderingContext2D, text: MapText) {
    ctx.save();
    ctx.translate(text.x, text.y);

    CanvasRenderer.text(ctx, text.text, 0, 0, {
      color: text.textColor,
      size: text.fontSize,
      font: text.fontFamily,
      baseline: "hanging",
    });

    ctx.restore();
  }
}
