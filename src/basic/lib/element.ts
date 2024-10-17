import { createElementWithProps } from '@basic/lib/dom';

export default class CustomHTMLElemnt {
  _dom: HTMLElement;
  renderList: Array<HTMLElement> = [];
  private props: { [key: string]: string };
  private id: string;
  get elementId(): string {
    return this.id;
  }
  constructor(tagName: string, props: { [key: string]: string } = {}) {
    this.id = props?.id ? props?.id : '';
    this._dom = createElementWithProps(tagName, props);
    this.props = props;
  }
  init() {
    // override
  }

  render() {
    // override
  }

  update(...args: any[]) {
    // override
  }
}
