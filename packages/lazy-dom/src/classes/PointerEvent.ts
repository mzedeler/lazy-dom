import { Event } from './Event'

export class UIEvent extends Event {}
export class MouseEvent extends UIEvent {}
export class KeyboardEvent extends UIEvent {}
export class InputEvent extends UIEvent {}
export class FocusEvent extends UIEvent {}
export class PointerEvent extends MouseEvent {}
