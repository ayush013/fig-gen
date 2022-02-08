import { NodeTypes } from "../../../figma/constants";
import { FigmaSceneNode } from "../../../figma/model";
import { IntermediateNode } from "./intermediate-node";
import { getTailwindOpacityMap } from "./tailwind-config-parser";

const opacityMap = getTailwindOpacityMap();

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
          const opacityClass = opacityMap.has(opacity)
            ? `${OPACITY_TOKEN}${opacityMap.get(opacity)}`
            : `${OPACITY_TOKEN}[${Number(opacity).toFixed(2)}]`;
          intermediateNode.addClass(`${opacityClass}`);
        }
      }

      break;
  }

  return intermediateNode;
}
