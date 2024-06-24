import { SelectionTargetType, SpotGroup, SpotItem } from "@/types";

export type EventType = "update" | "delete" | "add";

export interface MapEditorEventData {
  event: EventType;
  targetType?: SelectionTargetType;
  id?: EventResourceId;
  spot?: SpotItem;
  group?: SpotGroup;
}
export const EventResourceWildcard = "*";
export type EventResourceId = string;
export type EventFunction = (event: MapEditorEventData) => void;
export interface EventListenerData {
  event: EventType;
  listener: EventFunction;
}
export type EventListeners = Record<EventResourceId, EventListenerData[]>;

export class EventManager {
  private listeners: EventListeners = {};
  public queue: MapEditorEventData[] = [];

  public addListener(
    resourceId: EventResourceId,
    event: EventType,
    listener: EventFunction,
  ) {
    if (!this.listeners[resourceId]) {
      this.listeners[resourceId] = [];
    }
    this.listeners[resourceId].push({ event, listener });
  }

  public removeListener(
    resourceId: EventResourceId,
    event: EventType,
    listener: EventFunction,
  ) {
    if (!this.listeners[resourceId]) {
      return;
    }
    this.listeners[resourceId] = this.listeners[resourceId].filter(
      (l) => l.event !== event || l.listener !== listener,
    );
  }

  private handleEvent(event: MapEditorEventData) {
    const { id } = event;
    this.listeners[EventResourceWildcard]?.forEach((l) => {
      if (l.event === event.event) {
        l.listener(event);
      }
    });
    if (id && this.listeners[id]) {
      this.listeners[id].forEach((l) => {
        if (l.event === event.event) {
          l.listener(event);
        }
      });
    }
  }

  public dispatchEvent(event: MapEditorEventData, immediate = true) {
    if (!immediate) {
      this.queue.push(event);
      return;
    }

    this.handleEvent(event);
  }

  public processQueue() {
    if (!this.queue.length) {
      return;
    }
    this.queue.forEach((event) => {
      this.handleEvent(event);
    });
    this.queue = [];
  }
}
