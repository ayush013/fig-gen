import { TemplateIds } from "../templates";
import { IConnectedComponent, connectKey, IProps, IDispatch } from "./Connect";
import getCurrentRoutes from "./Routes";
import getStore, { Subscription } from "./Store";
import { Store } from "./Store";

// Base abstract class for all the Templates in the application. Markup is still in the HTML file only.
// Provides the common functionality for all the templates.
export abstract class BaseTemplate<T> implements IComponent {
  private __layoutRef: HTMLTemplateElement;
  private parentNode: HTMLElement;
  protected templateNode!: DocumentFragment;
  private _id: string | undefined;
  protected props: IProps<T> & IDispatch;
  private subscription!: Subscription;
  private readonly store: Store;
  private isRendered = false;

  constructor(parentNode: HTMLElement) {
    this.props = this.calculateProps();

    const id = this.getTemplateId();
    this.__layoutRef = document.getElementById(id) as HTMLTemplateElement;
    this.parentNode = parentNode;
    this.store = getStore();

    this.onMount();

    this.subscribeToStoreUpdates(id);
  }

  public get id() {
    return this._id;
  }

  // Props derived from connectKey Symbol that were added via connect function
  private calculateProps(): IProps<T> & IDispatch {
    return (this.constructor as unknown as IConnectedComponent)[connectKey];
  }

  // internal method responsible to updating/rendering/removing the template
  // Each template subscribes to the store and updates the template when the store changes
  private subscribeToStoreUpdates(id: TemplateIds) {
    this.subscription = this.store.subscribe(id, () => {
      // Get the current routes as per store state
      const currentActiveRoutes = getCurrentRoutes();

      if (currentActiveRoutes.includes(id)) {
        // The current route is active, so render/update the template

        // New props are calculated from the updated store state
        const nextProps = this.calculateProps();

        if (this.isRendered) {
          // If template already rendered, so update the template

          // If the template has implementation of shouldComponentUpdate method, then call it
          if (this.shouldComponentUpdate(nextProps)) {
            this.isRendered = this.destroy();
            this.props = nextProps;
            this.isRendered = this._render();
          }
        } else {
          // Template is rendering for the first time, so render it
          this.props = nextProps;
          this.isRendered = this._render();
        }
      } else {
        // The current route is not active, so remove the template if it is rendered
        if (this.isRendered) {
          this.isRendered = this.destroy();
        }
      }
    });
  }

  // method to be overridden by the child class to return the template id
  protected abstract getTemplateId(): TemplateIds;

  // onMount for constructor related tasks (if any)
  protected onMount() {}

  // method to be overridden by the child class to return component should update or not
  protected shouldComponentUpdate(_nextProps: IProps<T>): boolean {
    return true;
  }

  // render for the template specific logic
  protected render() {}

  // onDestroy for destructor related tasks (if any)
  protected onDestroy() {}

  // internal render method for appending the template to the parent node
  public _render(): boolean {
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

      return true;
    }

    return false;
  }

  // internal destroy method for removing the template from the parent node
  public destroy(): boolean {
    this.parentNode.querySelector(`[id='${this._id}']`)?.remove();
    this.onDestroy();

    return false;
  }
}

export interface IComponent {
  _render: () => void;
  destroy: () => void;
}
