import "figma-plugin-ds/dist/figma-plugin-ds.css";
import { figmaPostMessage, MessageTypes } from "../figma/utils/messages";
import { BaseTemplate, IComponent } from "./core/BaseTemplate";
import "./style.scss";
import getTemplateClass from "./templates";
import { TemplateIds } from "./templates";

// To do: Fix syntax
const { selectMenu, disclosure } = require("figma-plugin-ds");

selectMenu.init(); //initiates the select menu component
disclosure.init(); //initiates the disclosure component

class App implements IComponent {
  templateMap: Map<TemplateIds, BaseTemplate<any>>;
  bodyRef: HTMLBodyElement;

  constructor() {
    this.templateMap = new Map();
    this.bodyRef = document.getElementById(TemplateIds.Body) as HTMLBodyElement;

    this.render();
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

  render() {
    this.renderTemplate(TemplateIds.NoSelection);
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
