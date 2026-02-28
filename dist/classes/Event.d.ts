import { Future } from "../types/Future";
import { Node } from './Node/Node';
import { EventType } from '../types/EventType';
declare class EventStore {
    type: Future<EventType>;
    target: Future<Node>;
}
export declare class Event {
    eventStore: EventStore;
    defaultPrevented: boolean;
    cancelBubble: boolean;
    bubbles: boolean;
    cancelable: boolean;
    get target(): Node;
    get type(): EventType;
    preventDefault(): void;
    stopPropagation(): void;
    stopImmediatePropagation(): void;
}
export {};
