import "figma-plugin-ds/dist/figma-plugin-ds.css";
import { figmaPostMessage, MessageTypes } from "../figma/utils/messages";
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
    const template = new templateClass(id, ref);
    this.templateMap.set(id, template);
  }

  destroy() {
    for (let [templateId, template] of this.templateMap) {
      template.destroy();
      this.templateMap.delete(templateId);
    }
  }

  onMount() {
    this.subscription = this.store.subscribe("main", this.render.bind(this));
  }

  render() {
    const { state } = this.store;
    const {
      markup: { data, inProgress, error },
    } = state;

    if (!data && !inProgress) {
      this.renderTemplate(TemplateIds.NoSelection);
    }
  }
}

new App();

// const main = () => {

//   const cancel = document.getElementById("cancel");
//   cancel &&
//     cancel.addEventListener("click", () => {
//       figmaPostMessage(MessageTypes.CANCEL);
//     });
// };

// main();
