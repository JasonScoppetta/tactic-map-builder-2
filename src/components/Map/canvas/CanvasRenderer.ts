export class CanvasRenderer {
  static roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
  ) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  static circle(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
  ) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.closePath();
  }

  static text(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    options: {
      font?: string;
      size?: number;
      color?: string;
      align?: CanvasTextAlign;
      baseline?: CanvasTextBaseline;
    } = {},
  ) {
    const {
      font = "Quicksand",
      size = 12,
      color = "#000",
      align = "center",
      baseline = "middle",
    } = options;

    ctx.font = `${size}px ${font}`;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    ctx.fillText(text, x, y);
  }
}
