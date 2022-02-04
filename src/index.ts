import { nodeToObject } from "@figma-plugin/helpers";
import { FigmaSceneNode } from "./figma/model";
import { debounce } from "./figma/utils/debouce";
import {
  ErrorPayload,
  MarkupPayload,
  MessageTypes,
  NodePayload,
  postMessageToApp,
} from "./figma/utils/messages";
import {
  addRefToOriginalNode,
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
  const selectionList = figma.currentPage.selection;

  console.log("selection", selectionList);

  if (isEmptySelection(selectionList)) {
    postMessageToApp(MessageTypes.NO_SELECTION);
    return;
  }

  const selection = selectionList[0];

  // Only allowing Page level nodes - Just because you can do it, doesn't mean you should
  if (!isPageLevelNode(selection)) {
    postMessageToApp(
      MessageTypes.ERROR,
      new ErrorPayload("Only Page level nodes are supported")
    );
    return;
  }

  if (!isConversionSupported(selection)) {
    postMessageToApp(
      MessageTypes.ERROR,
      new ErrorPayload("Selected node is not a frame, component or instance.")
    );
    return;
  }

  if (!isNodeVisible(selection)) {
    postMessageToApp(
      MessageTypes.ERROR,
      new ErrorPayload("Selected node is not visible.")
    );
    return;
  }

  postMessageToApp(MessageTypes.IN_PROGRESS);

  const originalReferenceAdder = addRefToOriginalNode(selection);

  const compositeNodeProcessor = pipe(
    nodeToObject,
    originalReferenceAdder,
    trimNode
  );

  setTimeout(() => {
    compositeNodeProcessor(selection)
      .then((node: FigmaSceneNode) => {
        console.log(node);

        // do magic here

        postMessageToApp(MessageTypes.NODE_GENERATED, new NodePayload(node));

        //   postMessageToApp(
        //     MessageTypes.MARKUP_GENERATED,
        //     new MarkupPayload(
        //       `<div class="flex flex-col space-y-2 items-start justify-start">
        //   <p class="text-3xl font-bold text-gray-900">Starter board</p>
        //   <p class="w-full text-sm text-gray-600">A description of a board.</p>
        // </div>`,
        //       "Kanban Board"
        //     )
        //   );
      })
      .catch((error: Error) => {
        console.log(error);
        postMessageToApp(MessageTypes.ERROR, new ErrorPayload(error.message));
      });
  }, 100);
}, 1000);

main();

figma.on("selectionchange", main);
