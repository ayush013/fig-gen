import { nodeToObject } from "@figma-plugin/helpers";
import { debounce } from "./figma/utils/debouce";
import {
  ErrorPayload,
  MarkupPayload,
  MessageTypes,
  postMessageToApp,
} from "./figma/utils/messages";
import {
  isConversionSupported,
  isEmptySelection,
  isNodeVisible,
  isPageLevelNode,
  trimNode,
} from "./figma/utils/nodes";
import { pipe } from "./figma/utils/pipe";

// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 500, height: 400 });

// Skip over invisible nodes and their descendants inside instances for faster performance
figma.skipInvisibleInstanceChildren = true;

figma.ui.onmessage = (msg) => {
  console.log("onmessage", msg);
};

const main = debounce(() => {
  const selection = figma.currentPage.selection;

  console.log("selection", selection);

  if (isEmptySelection(selection)) {
    postMessageToApp(MessageTypes.NO_SELECTION);
    return;
  }

  // Only allowing Page level nodes - Just because you can do it, doesn't mean you should
  if (!isPageLevelNode(selection[0])) {
    postMessageToApp(
      MessageTypes.ERROR,
      new ErrorPayload("Only Page level nodes are supported")
    );
    return;
  }

  if (!isConversionSupported(selection[0])) {
    postMessageToApp(
      MessageTypes.ERROR,
      new ErrorPayload("Selected node is not a frame, component or instance.")
    );
    return;
  }

  if (!isNodeVisible(selection[0])) {
    postMessageToApp(
      MessageTypes.ERROR,
      new ErrorPayload("Selected node is not visible.")
    );
    return;
  }

  postMessageToApp(MessageTypes.IN_PROGRESS);

  const compositeNodeProcessor = pipe(nodeToObject, trimNode);

  const node = compositeNodeProcessor(selection[0]);

  console.log(node);

  setTimeout(() => {
    postMessageToApp(
      MessageTypes.MARKUP_GENERATED,
      new MarkupPayload(
        `<div class="flex flex-col space-y-2 items-start justify-start">
      <p class="text-3xl font-bold text-gray-900">Starter board</p>
      <p class="w-full text-sm text-gray-600">A description of a board.</p>
    </div>`,
        "Kanban Board"
      )
    );
  }, 1000);
}, 1000);

main();

figma.on("selectionchange", main);
