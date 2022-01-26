import { debounce } from "./figma/utils/debouce";
import { MessageTypes, postMessageToApp } from "./figma/utils/messages";
import { isEmptySelection } from "./figma/utils/nodes";

// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 500, height: 400 });

// Skip over invisible nodes and their descendants inside instances for faster performance
figma.skipInvisibleInstanceChildren = true;

figma.ui.onmessage = (msg) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  // if (msg.type === "create-rectangles") {
  //   const nodes: SceneNode[] = [];
  //   for (let i = 0; i < msg.count; i++) {
  //     const rect = figma.createRectangle();
  //     rect.x = i * 150;
  //     rect.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }];
  //     figma.currentPage.appendChild(rect);
  //     nodes.push(rect);
  //   }
  //   figma.currentPage.selection = nodes;
  //   figma.viewport.scrollAndZoomIntoView(nodes);
  // }
  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // figma.closePlugin();
};

const main = debounce(() => {
  const selection = figma.currentPage.selection;
  console.log(figma.currentPage.selection);
  if (isEmptySelection(selection)) {
    postMessageToApp(MessageTypes.NO_SELECTION);
    return;
  }

  postMessageToApp(MessageTypes.IN_PROGRESS);

  setTimeout(() => {
    postMessageToApp(MessageTypes.MARKUP_GENERATED, {
      data: {
        selectedFrame: "Frame ABC",
        markup: `<div class="flex flex-col space-y-2 items-start justify-start">
        <p class="text-3xl font-bold text-gray-900">Starter board</p>
        <p class="w-full text-sm text-gray-600">A description of a board.</p>
      </div>`,
      },
    });
  }, 1000);
}, 1000);

main();

figma.on("selectionchange", main);
