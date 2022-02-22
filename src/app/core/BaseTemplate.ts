import { IConnectedComponent, connectKey, IProps, IDispatch } from "./Connect";

// Base abstract class for all the Templates in the application. Markup is still in the HTML file only.
// Provides the common functionality for all the templates.

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

  // method to be overridden by the child class to return the template id
  protected abstract getTemplateId(): string;

  // onMount for constructor related tasks (if any)
  protected onMount() {}

  // render for the template specific logic
  protected render() {}

  // onDestroy for destructor related tasks (if any)
  protected onDestroy() {}

  // internal render methof for appending the template to the parent node
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

  // internal destroy method for removing the template from the parent node
  public destroy() {
    this.parentNode.querySelector(`[id='${this._id}']`)?.remove();
    this.onDestroy();
  }
}

export interface IComponent {
  _render: () => void;
  destroy: () => void;
}
