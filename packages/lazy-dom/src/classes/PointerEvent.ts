import { Event } from './Event'

class UIEvent extends Event {}
class MouseEvent extends UIEvent {}
export class PointerEvent extends MouseEvent {}
