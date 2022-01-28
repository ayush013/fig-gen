import { isPageNode } from "@figma-plugin/helpers";
import { FigmaFrameNode } from "../model";

export enum NodeTypes {
  FRAME = "FRAME",
  COMPONENT = "COMPONENT",
  INSTANCE = "INSTANCE",
  GROUP = "GROUP",
}

export function isConversionSupported(
  node: SceneNode
): node is FrameNode | ComponentNode | InstanceNode {
  const { type } = node;
  return (
    type === NodeTypes.FRAME ||
    type === NodeTypes.GROUP ||
    type === NodeTypes.COMPONENT ||
    type === NodeTypes.INSTANCE
  );
}

export function isEmptySelection(selection: ReadonlyArray<SceneNode>): boolean {
  return selection.length === 0;
}

export function isPageLevelNode(node: Readonly<BaseNode>): boolean {
  return isPageNode(node.parent as BaseNode);
}

export function supportsAutoLayout(node: any) {
  return node.layoutMode === "HORIZONTAL" || node.layourMode === "VERTICAL";
}

const ACCEPTED_KEYS = {
  CHILDREN: "children",
  COMMON: ["type", "name"],
  FRAME: [
    "layoutMode",
    "primaryAxisSizingMode",
    "counterAxisSizingMode",
    "primaryAxisAlignItems",
    "counterAxisAlignItems",
    "paddingLeft",
    "paddingRight",
    "paddingTop",
    "paddingBottom",
    "itemSpacing",
    "fills",
    "strokes",
    "strokeWeight",
    "cornerRadius",
    "topLeftRadius",
    "topRightRadius",
    "bottomLeftRadius",
    "bottomRightRadius",
    "opacity",
    "effects",
    "rotation",
    "width",
    "height",
    "layoutAlign",
    "layoutGrow",
    "constraints",
  ],
};

export function trimNode(
  node: FrameNode | ComponentNode | InstanceNode | GroupNode
) {
  const { type } = node;

  switch (type) {
    case NodeTypes.FRAME:
      return trimFrameNode(node);
  }

  return {};
}

function trimFrameNode(node: FrameNode): FigmaFrameNode {
  const convertedObj: FigmaFrameNode = {} as FigmaFrameNode;
  for (const key of [
    ...ACCEPTED_KEYS.COMMON,
    ...ACCEPTED_KEYS.FRAME,
    ACCEPTED_KEYS.CHILDREN,
  ]) {
    if (key in node) {
      if (key === ACCEPTED_KEYS.CHILDREN) {
        // @ts-ignore - todo: fix this
        convertedObj[key] = node[key].map((child) => trimNode(child));
      } else {
        // @ts-ignore - todo: fix this
        convertedObj[key] = node[key];
      }
    }
  }

  if (supportsAutoLayout(node)) {
    convertedObj.autoLayout = true;
  }

  return convertedObj as FigmaFrameNode;
}
