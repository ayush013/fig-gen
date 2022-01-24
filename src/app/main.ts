import "figma-plugin-ds/dist/figma-plugin-ds.css";
import { postMessageToFigma, MessageTypes } from "../figma/utils/messages";
import { BaseTemplate, IComponent } from "./core/BaseTemplate";
import { appReducer } from "./core/Reducer";
import Store, { Subscription } from "./core/Store";
import "./style.scss";
import getTemplateClass from "./templates";
import { TemplateIds } from "./templates";

// To do: Fix syntax
const { selectMenu, disclosure } = require("figma-plugin-ds");

selectMenu.init(); //initiates the select menu component
disclosure.init(); //initiates the disclosure component

class App implements IComponent {
  private templateMap: Map<TemplateIds, BaseTemplate<any>>;
  private bodyRef: HTMLBodyElement;
  private readonly store: Store;
  private subscription: Subscription | undefined;

  constructor() {
    this.templateMap = new Map();
    this.bodyRef = document.getElementById(TemplateIds.Body) as HTMLBodyElement;
    this.store = new Store(appReducer, true);

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
    this.subscription = this.store.subscribe("main", () => {
      // To do: Diffing the state and rendering only the changed components
      this.destroy();

      this.render();
    });
  }

  getCurrentState() {
    const { state } = this.store;
    const {
      markup: { data, inProgress, error },
      selectedFrame,
    } = state;

    if (data && !inProgress && !error) {
      return TemplateIds.Markup;
    } else if (inProgress) {
      return TemplateIds.InProgress;
    } else if (error) {
      return TemplateIds.Error;
    } else if (!data && !inProgress && !error) {
      return TemplateIds.NoSelection;
    } else if (selectedFrame && !error) {
      return TemplateIds.SelectedFrame;
    }
  }

  render() {
    const currentState = this.getCurrentState();

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
      case TemplateIds.SelectedFrame:
        this.renderTemplate(TemplateIds.SelectedFrame);
        break;
      default:
        break;
    }
  }
}

new App();

// const main = () => {

//   const cancel = document.getElementById("cancel");
//   cancel &&
//     cancel.addEventListener("click", () => {
//       postMessageToFigma(MessageTypes.CANCEL);
//     });
// };

// main();
