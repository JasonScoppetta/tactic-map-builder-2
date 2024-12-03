import { Canvas } from "fabric";
import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import { MapEditorEventData } from "@/helpers/event-manager";

export function useInitCanvasEvents() {
  const editor = useMapEditor();

  return (fabricCanvas?: Canvas) => {
    if (!fabricCanvas || !editor) return;

    let selectedMainTool: string | null = null;

    // Your SVG string
    const svgString = `
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_8_111)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M22 15.5068L10 10L12.8382 23L16.3062 17.8654L22 15.5068Z" fill="#363B3E"/>
<path d="M22.1914 15.9687L23.2499 15.5302L22.2085 15.0523L10.2085 9.54556L9.29776 9.12761L9.51151 10.1066L12.3497 23.1066L12.5988 24.2477L13.2525 23.2799L16.6364 18.2698L22.1914 15.9687Z" stroke="white" stroke-miterlimit="16"/>
</g>
<defs>
<filter id="filter0_d_8_111" x="5.59552" y="6.25522" width="19.8216" height="23.2402" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="1.5"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_8_111"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_8_111" result="shape"/>
</filter>
</defs>
</svg>
`;

    // Convert SVG to Data URI
    const svgDataURI = `data:image/svg+xml;base64,${btoa(svgString)}`;

    // Set the custom cursor for the canvas
    fabricCanvas.defaultCursor = `url(${svgDataURI}) 16 16, auto`;
    fabricCanvas.hoverCursor = `url(${svgDataURI}) 16 16, auto`;
    fabricCanvas.freeDrawingCursor = `url(${svgDataURI}) 16 16, auto`;
    fabricCanvas.notAllowedCursor = `url(${svgDataURI}) 16 16, auto`;

    const handleEditorToolChange = (event: MapEditorEventData) => {
      selectedMainTool = event.state?.selectedMainTool || "";
      if (event.state?.selectedMainTool === "moveMap") {
        //fabricCanvas.defaultCursor = "grab";
      } else {
        //fabricCanvas.defaultCursor = "default";
      }
    };

    let isPanning = false;
    let lastPosX = 0;
    let lastPosY = 0;

    editor.events.addListener("*", "tool-change", handleEditorToolChange);

    fabricCanvas.on("mouse:down", (opt) => {
      const evt = opt.e as MouseEvent;
      if (selectedMainTool === "moveMap" || evt.altKey) {
        isPanning = true;
        fabricCanvas.selection = false;
        lastPosX = evt.clientX;
        lastPosY = evt.clientY;
        fabricCanvas.setCursor("grab");
      }
    });

    fabricCanvas.on("mouse:move", (opt) => {
      if (isPanning) {
        const evt = opt.e as MouseEvent;
        const deltaX = evt.clientX - lastPosX;
        const deltaY = evt.clientY - lastPosY;

        const vpt = fabricCanvas.viewportTransform!;
        vpt[4] += deltaX;
        vpt[5] += deltaY;

        fabricCanvas.requestRenderAll();
        lastPosX = evt.clientX;
        lastPosY = evt.clientY;
      }
    });

    fabricCanvas.on("mouse:up", () => {
      isPanning = false;
      fabricCanvas.selection = true;
      fabricCanvas.setCursor("default");
    });

    return () => {
      editor?.events.removeListener("*", "tool-change", handleEditorToolChange);
      fabricCanvas?.off("mouse:down");
      fabricCanvas?.off("mouse:move");
      fabricCanvas?.off("mouse:up");
    };
  };
}
