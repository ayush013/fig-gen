import { NodeTypes } from "../../../figma/constants";
import { FigmaFrameNode, FigmaSceneNode } from "../../../figma/model";
import { IntermediateNode } from "./intermediate-node";
import getSpacingClass from "../shared/getSpacing";
import { IAppActions, SetWarningAction } from "../../core/ActionTypes";

const GAP_TOKEN = "gap-";

export default function addLayoutClasses(
  intermediateNode: IntermediateNode,
  dispatch: (action: IAppActions) => void
): IntermediateNode {
  const node: FigmaSceneNode = intermediateNode.getNode();

  const { type } = node;

  switch (type) {
    case NodeTypes.FRAME:
      {
        const { autoLayout } = node;

        // Only supports auto layout for now
        if (autoLayout) {
          intermediateNode.addClass("flex");

          addFlexDirection(node, intermediateNode);
          addFlexGap(node, intermediateNode);
          addFlexAlignment(node, intermediateNode);
          addOverflow(node, intermediateNode);
        } else {
          dispatch(
            new SetWarningAction(
              `Layer Name: ${node.name} - doesn't have auto layout, generated code might not be correct.`
            )
          );
        }
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

function addFlexAlignment(
  node: FigmaFrameNode,
  intermediateNode: IntermediateNode
) {
  const { primaryAxisAlignItems, counterAxisAlignItems, layoutMode } = node;

  if (layoutMode !== "NONE") {
    switch (primaryAxisAlignItems) {
      case "CENTER":
        intermediateNode.addClass("justify-center");
        break;
      case "MIN":
        intermediateNode.addClass("justify-start");
        break;
      case "MAX":
        intermediateNode.addClass("justify-end");
        break;
      case "SPACE_BETWEEN":
        intermediateNode.addClass("justify-between");
        break;
    }

    switch (counterAxisAlignItems) {
      case "CENTER":
        intermediateNode.addClass("items-center");
        break;
      case "MIN":
        intermediateNode.addClass("items-start");
        break;
      case "MAX":
        intermediateNode.addClass("items-end");
        break;
    }
  }
}

function addFlexGap(node: FigmaFrameNode, intermediateNode: IntermediateNode) {
  const { itemSpacing, primaryAxisAlignItems } = node;

  if (itemSpacing !== 0 && primaryAxisAlignItems !== "SPACE_BETWEEN") {
    intermediateNode.addClass(getSpacingClass(itemSpacing, GAP_TOKEN));
  }
}

function addOverflow(node: FigmaFrameNode, intermediateNode: IntermediateNode) {
  const { clipsContent } = node;

  clipsContent && intermediateNode.addClass("overflow-hidden");
}

function addFlexDirection(
  node: FigmaFrameNode,
  intermediateNode: IntermediateNode
) {
  const { layoutMode } = node;

  if (layoutMode === "HORIZONTAL") {
    intermediateNode.addClass("flex-row");
  } else if (layoutMode === "VERTICAL") {
    intermediateNode.addClass("flex-col");
  }
}
