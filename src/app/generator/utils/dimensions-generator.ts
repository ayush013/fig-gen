import { NodeTypes } from "../../../figma/constants";
import { FigmaFrameNode, FigmaSceneNode } from "../../../figma/model";
import { IntermediateNode } from "./intermediate-node";
import { getTailwindMaxWidthMap } from "../shared/tailwind-config-parser";
import getParentNodeById from "../shared/getParentNodeById";
import getSpacingClass from "../shared/getSpacing";

const maxWidthMap = getTailwindMaxWidthMap();

const MAX_WIDTH_TOKEN = "max-w-";
const WIDTH_TOKEN = "w-";

export default function addDimensionClasses(
  intermediateNode: IntermediateNode
): IntermediateNode {
  const node: FigmaSceneNode = intermediateNode.getNode();

  const { type, parent, height, width } = node;

  switch (type) {
    case NodeTypes.FRAME:
      {
        const {
          autoLayout,
          parent: { id: parentId },
        } = node;

        if (applyMaxWidthToRootNode(parent, intermediateNode, width)) {
          break;
        }

        if (autoLayout) {
          const parentNode = getParentNodeById(parentId);

          if (parentNode && parentNode.type === NodeTypes.FRAME) {
            const { layoutMode: parentLayoutMode } = parentNode;

            if (hasFixedWidth(node, parentLayoutMode)) {
              intermediateNode.addClass(getSpacingClass(width, WIDTH_TOKEN));
              break;
            }

            if (hasFullWidth(node, parentLayoutMode)) {
              intermediateNode.addClass(`${WIDTH_TOKEN}full`);
              break;
            }
          }
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

function hasFullWidth(
  node: FigmaFrameNode,
  parentLayoutMode: "VERTICAL" | "HORIZONTAL" | "NONE"
): boolean {
  const {
    layoutMode,
    layoutAlign,
    layoutGrow,
    primaryAxisSizingMode,
    counterAxisSizingMode,
  } = node;

  if (
    (layoutMode === "HORIZONTAL" && primaryAxisSizingMode === "FIXED") ||
    (layoutMode === "VERTICAL" && counterAxisSizingMode === "FIXED")
  ) {
    return (
      (parentLayoutMode === "VERTICAL" && layoutAlign === "STRETCH") ||
      (parentLayoutMode === "HORIZONTAL" && layoutGrow === 1)
    );
  }

  return false;
}

function hasFixedWidth(
  node: FigmaFrameNode,
  parentLayoutMode: "VERTICAL" | "HORIZONTAL" | "NONE"
): boolean {
  const {
    layoutAlign,
    layoutGrow,
    layoutMode,
    counterAxisSizingMode,
    primaryAxisSizingMode,
  } = node;

  if (
    (layoutMode === "HORIZONTAL" && primaryAxisSizingMode === "FIXED") ||
    (layoutMode === "VERTICAL" && counterAxisSizingMode === "FIXED")
  ) {
    return (
      (parentLayoutMode === "VERTICAL" && layoutAlign === "INHERIT") ||
      (parentLayoutMode === "HORIZONTAL" && layoutGrow === 0)
    );
  }

  return false;
}

function applyMaxWidthToRootNode(
  parent: { id: string; type: NodeTypes },
  intermediateNode: IntermediateNode,
  width: number
): boolean {
  if (parent.type === NodeTypes.PAGE) {
    intermediateNode.addClass(getMaxWidthClass(width, MAX_WIDTH_TOKEN));
    intermediateNode.addClass("mx-auto");
    return true;
  }

  return false;
}
