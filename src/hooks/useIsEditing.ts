import {useMapEditor} from "@/components/Map/providers/MapEditorProvider/context";

export const useIsEditing = () => {
    const editor = useMapEditor();
    if(!editor) return false;
    return editor.isEditing;
}
