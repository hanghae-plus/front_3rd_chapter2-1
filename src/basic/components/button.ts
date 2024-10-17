import { createElementWithProps } from '@basic/lib/dom';
import { addEvent } from '@basic/utils/event/eventManager';

export default class Button {
  _dom: HTMLButtonElement;
  constructor(props: { [key: string]: string }) {
    this._dom = createElementWithProps('button', props) as HTMLButtonElement;
  }

  addEventListener(eventType: string, handler: EventListener) {
    addEvent(eventType, this._dom, handler);
  }

  updateText(text: string) {
    this._dom.textContent = text;
  }
}
