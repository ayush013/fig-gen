import { NodeTypes } from "../../../figma/constants";
import { FigmaFrameNode, FigmaSceneNode } from "../../../figma/model";
import { IntermediateNode } from "./intermediate-node";
import getSpacingClass from "./shared/getSpacing";

const GAP_TOKEN = "gap-";

export default function addLayoutClasses(
  intermediateNode: IntermediateNode
): IntermediateNode {
  const node: FigmaSceneNode = intermediateNode.getNode();

  const { type } = node;

  switch (type) {
    case NodeTypes.FRAME:
      {
        intermediateNode.addClass("flex");

        addFlexDirection(node, intermediateNode);

        addFlexGap(node, intermediateNode);
      }
      break;

    case NodeTypes.TEXT:
      {
        intermediateNode.addClass("block");
      }
      break;

    case NodeTypes.VECTOR:
      {
        intermediateNode.addClass("block");
      }
      break;
  }

  return intermediateNode;
}

function addFlexGap(node: FigmaFrameNode, intermediateNode: IntermediateNode) {
  const { itemSpacing } = node;

  if (itemSpacing !== 0) {
    intermediateNode.addClass(getSpacingClass(itemSpacing, GAP_TOKEN));
  }
}

function addFlexDirection(
  node: FigmaFrameNode,
  intermediateNode: IntermediateNode
) {
  const { layoutMode } = node;

  if (layoutMode === "HORIZONTAL") {
    intermediateNode.addClass("flex-row");
  } else if (layoutMode === "VERTICAL") {
    intermediateNode.addClass("flex-column");
  }
}
