import { NodeTypes } from "../../../figma/constants";
import { FigmaFrameNode, FigmaSceneNode } from "../../../figma/model";
import { IntermediateNode } from "./intermediate-node";
import { getTailwindMaxWidthMap } from "../shared/tailwind-config-parser";

const maxWidthMap = getTailwindMaxWidthMap();

const MAX_WIDTH_TOKEN = "max-w-";

export default function addDimensionClasses(
  intermediateNode: IntermediateNode
): IntermediateNode {
  const node: FigmaSceneNode = intermediateNode.getNode();

  const { type, parent } = node;

  switch (type) {
    case NodeTypes.FRAME:
      {
        const { height, width, autoLayout } = node;

        if (parent.type === NodeTypes.PAGE) {
          intermediateNode.addClass(getMaxWidthClass(width, MAX_WIDTH_TOKEN));
        }
      }
      break;

    case NodeTypes.TEXT:
      {
      }
      break;

    case NodeTypes.VECTOR:
      {
        const { height, width } = node;
      }
      break;
  }

  return intermediateNode;
}

const getMaxWidthClass = (width: number, token: string) => {
  const widthInRem = width / 16;
  return maxWidthMap.has(width)
    ? `${token}${maxWidthMap.get(width)}`
    : `${token}[${
        Number.isInteger(widthInRem)
          ? widthInRem
          : Number(widthInRem).toFixed(2)
      }rem]`;
};
