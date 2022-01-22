export class BaseTemplate<T> {
  __layoutRef: HTMLTemplateElement | null;
  parentNode: HTMLElement;
  data: T | undefined;
  templateNode: DocumentFragment | undefined;
  _id: string | undefined;

  constructor(id: string, parentNode: HTMLElement, data?: T) {
    this.__layoutRef = document.getElementById(id) as HTMLTemplateElement;
    this.parentNode = parentNode;

    this.render();
  }

  get id() {
    return this._id;
  }

  render() {
    this.templateNode = this.__layoutRef?.content.cloneNode(
      true
    ) as DocumentFragment;

    if (this.templateNode) {
      this._id = Date.now().toString();

      const { firstElementChild } = this.templateNode;

      if (firstElementChild) {
        firstElementChild.id = this._id;
      }

      this.parentNode.appendChild(this.templateNode);
    }
  }

  destroy() {
    this.parentNode.querySelector(`[id='${this._id}']`)?.remove();
  }
}
