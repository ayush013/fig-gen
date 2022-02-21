import { nodeToObject } from "@figma-plugin/helpers";
import { FigmaSceneNode } from "./figma/model";
import { debounce } from "./figma/utils/debouce";
import {
  ErrorPayload,
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

// Debounced selection to wait for user to finish selecting the frame
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

  // Only allowing Frame, Group and Component nodes
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

  // Set progress UI to the iframe
  postMessageToApp(MessageTypes.IN_PROGRESS);

  // To add the reference to original SceneNode to be used in exporting the image/vector if any`
  const originalReferenceAdder = addRefToOriginalNode(selection);

  // Function that converts the SceneNode to FigmaSceneNode
  const compositeNodeProcessor = pipe([
    nodeToObject,
    originalReferenceAdder,
    trimNode,
  ]);

  // todo: fix this - this is to prevent blocking UI from showing
  setTimeout(() => {
    compositeNodeProcessor(selection)
      .then((node: FigmaSceneNode) => {
        console.log(node);

        postMessageToApp(MessageTypes.NODE_GENERATED, new NodePayload(node));
      })
      .catch((error: Error) => {
        console.log(error);
        postMessageToApp(MessageTypes.ERROR, new ErrorPayload(error.message));
      });
  }, 100);
}, 1000);

main();

figma.on("selectionchange", main);
