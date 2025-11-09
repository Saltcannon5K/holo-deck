import { EventEmitter } from "events";

EventEmitter.setMaxListeners(15);

export const DataEvents = new EventEmitter();
