import "figma-plugin-ds/dist/figma-plugin-ds.css";
import { figmaPostMessage, MessageTypes } from "./message/index";
import "./style.scss";

// To do: Fix syntax
const { selectMenu, disclosure } = require("figma-plugin-ds");

selectMenu.init(); //initiates the select menu component
disclosure.init(); //initiates the disclosure component

const main = () => {
  const create = document.getElementById("create");
  create &&
    create.addEventListener("click", () => {
      const textbox = document.getElementById("count");
      const count = parseInt((textbox as any).value, 10);
      parent.postMessage(
        { pluginMessage: { type: "create-rectangles", count } },
        "*"
      );
    });

  const cancel = document.getElementById("cancel");
  cancel &&
    cancel.addEventListener("click", () => {
      figmaPostMessage(MessageTypes.CANCEL);
    });
};

main();
