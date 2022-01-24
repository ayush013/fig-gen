export abstract class BaseTemplate<T> implements IComponent {
  private __layoutRef: HTMLTemplateElement;
  private parentNode: HTMLElement;
  private data: T | undefined;
  private templateNode: DocumentFragment | undefined;
  private _id: string | undefined;

  constructor(parentNode: HTMLElement, data?: T) {
    const id = this.getTemplateId();
    this.__layoutRef = document.getElementById(id) as HTMLTemplateElement;
    this.parentNode = parentNode;
    this.data = data;

    this.onMount();

    this.render();
  }

  public get id() {
    return this._id;
  }

  protected abstract getTemplateId(): string;

  protected onMount() {}
  protected onRender() {}
  protected onDestroy() {}

  public render() {
    this.templateNode = this.__layoutRef?.content.cloneNode(
      true
    ) as DocumentFragment;

    if (this.templateNode) {
      this._id = Date.now().toString();

      const { firstElementChild } = this.templateNode;

      if (firstElementChild) {
        firstElementChild.id = this._id;
      }

      this.onRender();

      this.parentNode.appendChild(this.templateNode);
    }
  }

  public destroy() {
    this.parentNode.querySelector(`[id='${this._id}']`)?.remove();
    this.onDestroy();
  }
}

export interface IComponent {
  render: () => void;
  destroy: () => void;
}
