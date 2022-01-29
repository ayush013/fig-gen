import { isPageNode } from "@figma-plugin/helpers";
import { FigmaFrameNode, FigmaGroupNode } from "../model";

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

export function supportsAutoLayout(node: FrameNode) {
  return node.layoutMode === "HORIZONTAL" || node.layoutMode === "VERTICAL";
}

export function isNodeVisible(node: SceneNode): boolean {
  return node.visible;
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
  GROUP: [
    "fills",
    "strokes",
    "strokeWeight",
    "opacity",
    "effects",
    "layoutAlign",
    "layoutMode",
    "primaryAxisSizingMode",
    "counterAxisSizingMode",
    "primaryAxisAlignItems",
    "counterAxisAlignItems",
    "itemSpacing",
    "layoutGrow",
    "constraints",
    "cornerRadius",
    "topLeftRadius",
    "topRightRadius",
    "bottomLeftRadius",
    "bottomRightRadius",
    "width",
    "height",
  ],
};

export function trimNode(node: SceneNode) {
  const { type } = node;

  if (isNodeVisible(node)) {
    switch (type) {
      case NodeTypes.FRAME:
        return trimFrameNode(node);
      case NodeTypes.GROUP:
        return trimGroupNode(node);

      default:
        return node;
    }
  }
}

function trimFrameNode(node: FrameNode): FigmaFrameNode {
  const trimmedNode: FigmaFrameNode = {} as FigmaFrameNode;
  for (const key of [
    ...ACCEPTED_KEYS.COMMON,
    ...ACCEPTED_KEYS.FRAME,
    ACCEPTED_KEYS.CHILDREN,
  ]) {
    if (key in node) {
      if (key === ACCEPTED_KEYS.CHILDREN) {
        // @ts-ignore - todo: fix this
        trimmedNode[key] = node[key]
          .map((child: SceneNode) => trimNode(child))
          .filter((child: SceneNode) => !!child);
      } else {
        // @ts-ignore - todo: fix this
        trimmedNode[key] = node[key];
      }
    }
  }

  if (supportsAutoLayout(node)) {
    trimmedNode.autoLayout = true;
  }

  return trimmedNode;
}

function trimGroupNode(node: GroupNode): FigmaGroupNode {
  const trimmedNode: FigmaGroupNode = {} as FigmaGroupNode;
  for (const key of [
    ...ACCEPTED_KEYS.COMMON,
    ...ACCEPTED_KEYS.GROUP,
    ACCEPTED_KEYS.CHILDREN,
  ]) {
    if (key in node) {
      if (key === ACCEPTED_KEYS.CHILDREN) {
        // @ts-ignore - todo: fix this
        trimmedNode[key] = node[key]
          .map((child: SceneNode) => trimNode(child))
          .filter((child: SceneNode) => !!child);
      } else {
        // @ts-ignore - todo: fix this
        trimmedNode[key] = node[key];
      }
    }
  }

  return trimmedNode;
}
