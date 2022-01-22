import "figma-plugin-ds/dist/figma-plugin-ds.css";
import { figmaPostMessage, MessageTypes } from "../figma/utils/messages";
import { BaseTemplate } from "./core/BaseTemplate";
import "./style.scss";
import { TemplateMap } from "./templates";

// To do: Fix syntax
const { selectMenu, disclosure } = require("figma-plugin-ds");

selectMenu.init(); //initiates the select menu component
disclosure.init(); //initiates the disclosure component

const main = () => {
  const bodyRef = document.getElementById("body") as HTMLBodyElement;
  const template = new BaseTemplate(TemplateMap.NoSelection, bodyRef);

  console.log("template", template);

  setTimeout(() => {
    template.destroy();
  }, 5000);

  const cancel = document.getElementById("cancel");
  cancel &&
    cancel.addEventListener("click", () => {
      figmaPostMessage(MessageTypes.CANCEL);
    });
};

main();
