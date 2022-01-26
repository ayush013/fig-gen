import { IConnectedComponent, connectKey, IProps, IDispatch } from "./Connect";

export abstract class BaseTemplate<T> implements IComponent {
  private __layoutRef: HTMLTemplateElement;
  private parentNode: HTMLElement;
  protected templateNode!: DocumentFragment;
  private _id: string | undefined;
  protected props: IProps<T> & IDispatch;

  constructor(parentNode: HTMLElement) {
    this.props = (this.constructor as unknown as IConnectedComponent)[
      connectKey
    ];

    const id = this.getTemplateId();
    this.__layoutRef = document.getElementById(id) as HTMLTemplateElement;
    this.parentNode = parentNode;

    this.onMount();

    this._render();
  }

  public get id() {
    return this._id;
  }

  protected abstract getTemplateId(): string;

  protected onMount() {}
  protected render() {}
  protected onDestroy() {}

  public _render() {
    this.templateNode = this.__layoutRef?.content.cloneNode(
      true
    ) as DocumentFragment;

    if (this.templateNode) {
      this._id = Date.now().toString();

      const { firstElementChild } = this.templateNode;

      if (firstElementChild) {
        firstElementChild.id = this._id;
      }

      this.render();

      this.parentNode.appendChild(this.templateNode);
    }
  }

  public destroy() {
    this.parentNode.querySelector(`[id='${this._id}']`)?.remove();
    this.onDestroy();
  }
}

export interface IComponent {
  _render: () => void;
  destroy: () => void;
}
