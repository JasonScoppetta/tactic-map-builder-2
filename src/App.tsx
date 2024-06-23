import { Layers } from "@/components/Layers/Layers";
import { MapEditorProvider } from "@/components/Map/providers/MapEditorProvider/MapEditorProvider";
import { cn } from "@/helpers/cn";
import { Map } from "./components/Map/Map";
import { SpotGroup as ISpotGroup } from "./types";
import "./App.css";

const spotGroups: ISpotGroup[] = [
  {
    id: "4e915277-8928-4c47-baaa-b6cfafb89287",
    x: 100,
    y: 100,
    label: "Group 1",
    color: "#80C7DF",
    rows: [
      {
        color: "#E580FF",
        id: "df4b5850-aae8-43ac-936b-bf7bc30805c8",
        orientation: "top",
        items: [
          {
            id: "3d872827-f3e9-49bb-a287-a3884ee40584",
            type: "Desk",
            label: "AA",
          },
          {
            color: "blue",
            textColor: "#ffffff",
            id: "0b1d4960-b142-417b-afd7-5b6608e2fbaa",
            type: "Desk",
            label: "AB",
          },
          {
            id: "04070a2b-548c-443b-b0a5-c0bf194ddbaf",
            type: "Desk",
            label: "AC",
          },
          {
            id: "fbef005d-a58b-4af2-a54d-68dc81731efc",
            type: "Desk",
            label: "AD",
          },
        ],
      },
      {
        id: "7b14380b-d248-4544-bf4c-f716620aed21",
        orientation: "bottom",
        items: [
          {
            id: "8f250329-efd8-455b-b081-e8ea3547df87",
            type: "Desk",
            label: "AE",
          },
          {
            id: "fe69c153-9506-497f-be69-6f436411559a",
            type: "Desk",
            label: "AF",
          },
          {
            id: "58c82775-4063-42a5-b9cf-8ff365a5be5f",
            type: "Desk",
            label: "AG",
          },
          {
            id: "eca71378-0cb0-46f2-9c76-d582276bdfac",
            type: "Desk",
            label: "AH",
          },
        ],
      },
    ],
    orientation: "horizontal",
  },
  {
    id: "59dcdfd5-55c4-4c68-850b-6f2388e1185b",
    x: 300,
    y: 300,
    color: "#FF99CC",
    label: "Group 2",
    orientation: "vertical",
    rotation: 0,
    rows: [
      {
        id: "78109198-3a2c-408b-ad61-02e4db6bbbdd",
        orientation: "left",
        items: [
          {
            id: "24c146c8-af9f-4d88-9a2e-54b866da307a",
            type: "Desk",
            orientation: "top",
            label: "B1",
          },
          {
            id: "fe3fccbe-f925-406a-ba66-e7c8c4db8279",
            type: "Desk",
            orientation: "bottom",
            label: "B2",
          },
          {
            id: "84fe358f-7a50-47a7-af61-776b034382cc",
            type: "Desk",
            label: "B3",
          },
          {
            id: "acdbd9ba-49a0-436e-a5b2-864addca6b48",
            type: "Desk",
            label: "B4",
          },
        ],
      },
      {
        id: "7c0e6c15-b6ba-478b-8186-4da83fe1216a",
        orientation: "right",
        items: [
          {
            id: "80a2fd79-f325-42c1-bf2a-ab1b00793e82",
            type: "Desk",
            label: "B5",
          },
          {
            id: "2f9303be-d9f0-46e4-913d-a247f81ccd9f",
            type: "Desk",
            label: "B6",
          },
          {
            id: "8f26a34c-e1b4-43d1-a231-419e5eb06700",
            type: "Desk",
            label: "B7",
          },
          {
            id: "eb953e64-078f-4977-bb28-48c24708b5c6",
            type: "Desk",
            label: "B8",
          },
        ],
      },
      {
        id: "3802fdc5-8154-4e61-89a0-ed6fcd1e60cb",
        orientation: "left",
        items: [
          {
            id: "2161634f-63da-4c6c-911e-e84039a350a0",
            type: "Desk",
            label: "B9",
          },
          {
            id: "cd0a5d19-f7ee-433d-8c46-54463d50ea49",
            type: "Desk",
            label: "B10",
          },
          {
            id: "12329c67-c9b2-4296-91b8-8a646c9d6a8b",
            type: "Empty",
            label: "B11",
          },
          {
            id: "7447b9d0-e09a-4b69-8af9-1cbedcddb3b9",
            type: "Desk",
            label: "B12",
          },
        ],
      },
    ],
  },
  {
    id: "777197b5-6ff7-4902-bf9c-fa3a4ecd4567",
    x: 500,
    y: 500,
    label: "Group 3",
    color: "#F1EF80",
    rows: [
      {
        id: "833c0d76-3d3a-438f-8338-851e9ec4a19e",
        orientation: "top",
        items: [
          {
            id: "4e703987-35d7-4287-a4a0-eb662265435d",
            type: "Desk",
            label: "1",
          },
          {
            id: "cbedb5dd-45de-420e-b699-099eebc85fed",
            type: "Desk",
            label: "2",
          },
          {
            id: "c3e1ddca-cb0b-4443-b47f-0aa36d68d85a",
            type: "Desk",
            label: "3",
          },
          {
            id: "bd3edc40-60f4-4a2f-84bf-e9b6d0e403e6",
            type: "Desk",
            label: "4",
          },
        ],
      },
      {
        id: "a6f9451d-c766-4446-9966-ddd267bd8bbf",
        orientation: "bottom",
        items: [
          {
            id: "144cd9ba-086a-4bb5-b4d9-3b9d56024ab8",
            type: "Desk",
            label: "5",
          },
          {
            id: "fcf8f32f-2804-421b-a55b-12c7a9b14429",
            type: "Desk",
            label: "6",
          },
          {
            id: "50275889-d2fb-4bd4-a24c-cecf4798ccad",
            type: "Desk",
            label: "7",
          },
          {
            id: "9fb29652-e7d6-46a1-8e21-4eedace2d139",
            type: "Desk",
            label: "8",
          },
        ],
      },
    ],
    orientation: "horizontal",
  },
  {
    id: "57a360f5-9a70-46b5-9952-4a93b8f96741",
    x: 800,
    y: 100,
    color: "#A9C19A",
    label: "Group 4",
    orientation: "horizontal",
    rows: [
      {
        id: "c6820ef4-cf60-4842-a704-e82249d9e5d0",
        orientation: "top",
        items: [
          {
            id: "965308d8-cc67-41c7-9803-2dcbaa539870",
            type: "Desk",
            label: "CA",
          },
          {
            id: "21b949c2-c5cb-42e3-9a2f-ee9ae75fa2d5",
            type: "Desk",
            label: "CB",
          },
          {
            id: "bb6ed7fa-f02e-4698-a1bb-5996297104ab",
            type: "Desk",
            label: "CC",
          },
          {
            id: "b5e156d3-c93a-4639-bb2b-99465b57a6d6",
            type: "Desk",
            label: "CC",
          },
        ],
      },
      {
        id: "6d759088-3e53-4527-9ea7-451dd44a7358",
        orientation: "bottom",
        items: [
          {
            id: "6c72dcb7-de8e-4e07-9f18-dff61370fecd",
            type: "Desk",
            label: "CD",
          },
          {
            id: "4c1eb704-6fca-4a8c-a0f6-9b096c2634dd",
            type: "Desk",
            label: "CE",
          },
          {
            id: "af063bcc-c755-4d1e-bc49-95701c85d663",
            type: "Desk",
            label: "CF",
          },
          {
            id: "64270371-4f89-47f4-b0cc-fc296f74112d",
            type: "Desk",
            label: "CF",
          },
        ],
      },
      {
        id: "ad46ef52-1f1f-4e66-9798-027fc4d3d6a2",
        orientation: "top",
        items: [
          {
            id: "dd3b8be4-2263-4f52-ae69-a0dc7ab9e08d",
            type: "Desk",
            label: "D1",
          },
          {
            id: "f55ac23a-4718-4e82-bdbe-db16619ee381",
            type: "Desk",
            label: "D2",
          },
          {
            id: "1ca257df-7521-46cb-a48e-baeb14f1877a",
            type: "Desk",
            label: "D3",
          },
          {
            id: "0d821fa0-ff5a-4e4b-a6d8-149497444be4",
            type: "Desk",
            label: "D4",
          },
          {
            id: "8e8af9d3-a16f-45b9-99d5-b48e46ef4d67",
            type: "Desk",
            label: "D5",
          },
        ],
      },
      {
        id: "0cf75758-0b5f-4040-854d-8f37d49134f5",
        orientation: "bottom",
        items: [
          {
            id: "7ab0ab5f-84f8-4777-902f-c81c212caced",
            type: "Desk",
            label: "D6",
          },
          {
            id: "a09dd714-2546-4ca6-81ec-4189592a11d2",
            type: "Desk",
            label: "D7",
          },
          {
            id: "b9673695-ca3c-41f0-83a4-7479d3b5876d",
            type: "Desk",
            label: "D8",
          },
          {
            id: "3dd792a9-13b1-4e9f-8021-08d44c5a32d0",
            type: "Empty",
            label: "D9",
          },
          {
            id: "1e154e98-ee2b-451a-9581-e9db039973c1",
            type: "Desk",
            label: "D10",
          },
        ],
      },
    ],
  },
];

function App() {
  return (
    <MapEditorProvider
      value={{
        groups: spotGroups,
        width: 1300,
        height: 1138,
        gridSize: 10,
      }}
      showGrid
      isEditing
    >
      <div className={cn("flex h-screen w-screen")}>
        <div className={"w-[360px] bg-muted overflow-auto"}>
          <Layers />
        </div>
        <div className={cn("overflow-auto flex-grow")}>
          <Map />
        </div>
      </div>
    </MapEditorProvider>
  );
}

export default App;
