import { Future } from "../types/Future"
import valueNotSetError from "../utils/valueNotSetError"

import { Node } from './Node'
import { EventType } from '../types/EventType'

class EventStore {
  type: Future<EventType> = () => {
    throw valueNotSetError('type')
  }
  target: Future<Node> = () => {
    throw valueNotSetError('target')
  }
}

export class Event {
  eventStore = new EventStore()

  get target(): Node {
    return this.eventStore.target()
  }

  get type(): EventType {
    return this.eventStore.type()
  }
}
