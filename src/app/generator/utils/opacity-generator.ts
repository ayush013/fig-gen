import { NodeTypes } from "../../../figma/constants";
import { FigmaSceneNode } from "../../../figma/model";
import { IntermediateNode } from "./intermediate-node";
import getOpacityClass from "./shared/getOpacity";

const OPACITY_TOKEN = "opacity-";

export default function addOpacityClasses(
  intermediateNode: IntermediateNode
): IntermediateNode {
  const node: FigmaSceneNode = intermediateNode.getNode();

  const { type } = node;

  switch (type) {
    case NodeTypes.FRAME:
    case NodeTypes.TEXT:
    case NodeTypes.GROUP:
      {
        const { opacity } = node;

        if (opacity !== 1) {
          intermediateNode.addClass(
            `${getOpacityClass(opacity, OPACITY_TOKEN)}`
          );
        }
      }

      break;
  }

  return intermediateNode;
}
