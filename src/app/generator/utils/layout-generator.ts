import { NodeTypes } from "../../../figma/constants";
import { FigmaSceneNode } from "../../../figma/model";
import { IntermediateNode } from "./intermediate-node";

export default function addLayoutClasses(
  intermediateNode: IntermediateNode
): IntermediateNode {
  const node: FigmaSceneNode = intermediateNode.getNode();

  const { type } = node;

  switch (type) {
    case NodeTypes.FRAME:
      {
        intermediateNode.addClass("flex");

        const { layoutMode } = node;

        if (layoutMode === "HORIZONTAL") {
          intermediateNode.addClass("flex-row");
        } else if (layoutMode === "VERTICAL") {
          intermediateNode.addClass("flex-column");
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
