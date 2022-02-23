import {
  postMessageToFigma,
  MessageTypes,
  IMessage,
  INodePayload,
} from "../figma/utils/messages";
import {
  IAppActions,
  ResetAppStateAction,
  SetErrorAction,
  SetInProgressAction,
  SetNodeAction,
} from "./core/ActionTypes";
import getStore from "./core/Store";
import generateAndExport from "./generator";
import "./style.scss";
import getTemplateClass from "./templates";
import { TemplateIds } from "./templates";

class App {
  private bodyRef: HTMLBodyElement;
  private dispatch: (action: IAppActions) => void;

  constructor() {
    this.bodyRef = document.getElementById("body") as HTMLBodyElement;
    this.dispatch = getStore().dispatch;

    this.onMount();
  }

  private renderTemplate(id: TemplateIds, ref: HTMLElement = this.bodyRef) {
    const templateClass = getTemplateClass(id);
    return new templateClass(ref);
  }

  onMount() {
    this.subscribeToMessagesFromFigma();
    this.render();
  }

  subscribeToMessagesFromFigma() {
    onmessage = (msg: MessageEvent<any>) => {
      const { pluginMessage }: { pluginMessage: IMessage<any> } = msg.data;

      this.dispatch(new ResetAppStateAction());

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
          this.dispatch(new SetErrorAction(error));
          break;
        case MessageTypes.NO_SELECTION:
          this.dispatch(new ResetAppStateAction());
          break;
        case MessageTypes.IN_PROGRESS:
          this.dispatch(new SetInProgressAction());
          break;
        case MessageTypes.NODE_GENERATED:
          const { node } = pluginMessage.payload.data as INodePayload;
          this.dispatch(new SetNodeAction(node));
          generateAndExport(node);
          break;
        default:
          this.dispatch(new ResetAppStateAction());
          break;
      }
    };
  }

  render() {
    Object.keys(TemplateIds).forEach((id) => {
      const templateId = TemplateIds[id as keyof typeof TemplateIds];
      this.renderTemplate(templateId);
    });
  }
}

new App();
