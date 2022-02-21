import {
  postMessageToFigma,
  MessageTypes,
  IMessage,
  INodePayload,
} from "../figma/utils/messages";
import {
  ResetAppStateAction,
  SetErrorAction,
  SetInProgressAction,
  SetNodeAction,
} from "./core/ActionTypes";
import { BaseTemplate, IComponent } from "./core/BaseTemplate";
import getStore, { Store, Subscription } from "./core/Store";
import generateAndExport from "./generator";
import "./style.scss";
import getTemplateClass from "./templates";
import { TemplateIds } from "./templates";

class App implements IComponent {
  private templateMap: Map<TemplateIds, BaseTemplate<any>>;
  private bodyRef: HTMLBodyElement;
  private subscription: Subscription | undefined;

  private readonly store: Store;

  constructor() {
    this.templateMap = new Map();
    this.bodyRef = document.getElementById(TemplateIds.Body) as HTMLBodyElement;
    this.store = getStore();

    this.onMount();
  }

  private renderTemplate(id: TemplateIds, ref: HTMLElement = this.bodyRef) {
    const templateClass = getTemplateClass(id);
    const template = new templateClass(ref);
    this.templateMap.set(id, template);
  }

  destroy() {
    for (let [templateId, template] of this.templateMap) {
      template.destroy();
      this.templateMap.delete(templateId);
    }
  }

  onMount() {
    this.subscribeToMessagesFromFigma();
    this.subscription = this.store.subscribe("main", () => {
      // To do: Diffing the state and rendering only the changed components
      this.destroy();

      this._render();
    });
  }

  _render() {
    this.render();
  }

  subscribeToMessagesFromFigma() {
    onmessage = (msg: MessageEvent<any>) => {
      const { pluginMessage }: { pluginMessage: IMessage<any> } = msg.data;

      this.store.dispatch(new ResetAppStateAction());

      switch (pluginMessage.type) {
        case MessageTypes.CLOSE:
          postMessageToFigma(MessageTypes.CLOSE);
          break;
        case MessageTypes.ERROR:
          const {
            payload: {
              data: { error },
            },
          } = pluginMessage;
          this.store.dispatch(new SetErrorAction(error));
          break;
        case MessageTypes.NO_SELECTION:
          this.store.dispatch(new ResetAppStateAction());
          break;
        case MessageTypes.IN_PROGRESS:
          this.store.dispatch(new SetInProgressAction());
          break;
        case MessageTypes.NODE_GENERATED:
          const { node } = pluginMessage.payload.data as INodePayload;
          this.store.dispatch(new SetNodeAction(node));
          generateAndExport(node);
          break;
        default:
          this.store.dispatch(new ResetAppStateAction());
          break;
      }
    };
  }

  getCurrentState() {
    const {
      state: {
        markup: { data, inProgress, error },
      },
    } = this.store;

    if (data && !inProgress && !error) {
      return TemplateIds.Markup;
    } else if (inProgress) {
      return TemplateIds.InProgress;
    } else if (error) {
      return TemplateIds.Error;
    } else if (!data && !inProgress && !error) {
      return TemplateIds.NoSelection;
    }
  }

  render() {
    const currentState = this.getCurrentState();
    const {
      state: { dialog },
    } = this.store;

    if (dialog) {
      this.renderTemplate(TemplateIds.Dialog);
    }

    switch (currentState) {
      case TemplateIds.Markup:
        this.renderTemplate(TemplateIds.Markup);
        break;
      case TemplateIds.InProgress:
        this.renderTemplate(TemplateIds.InProgress);
        break;
      case TemplateIds.Error:
        this.renderTemplate(TemplateIds.Error);
        break;
      case TemplateIds.NoSelection:
        this.renderTemplate(TemplateIds.NoSelection);
        break;
      default:
        break;
    }
  }
}

new App();
