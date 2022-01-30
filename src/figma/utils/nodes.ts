import { hasChildren, isPageNode } from "@figma-plugin/helpers";
import { FigmaFrameNode, FigmaGroupNode, FigmaSceneNode } from "../model";

export enum NodeTypes {
  FRAME = "FRAME",
  COMPONENT = "COMPONENT",
  INSTANCE = "INSTANCE",
  GROUP = "GROUP",
  VECTOR = "VECTOR",
  RECTANGLE = "RECTANGLE",
  TEXT = "TEXT",
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

export function supportsAutoLayout(
  node: FrameNode | ComponentNode | InstanceNode
): boolean {
  return node.layoutMode === "HORIZONTAL" || node.layoutMode === "VERTICAL";
}

export function isNodeVisible(node: SceneNode): boolean {
  return node.visible;
}

const ACCEPTED_KEYS = {
  CHILDREN: "children",
  COMMON: ["type", "name", "originalRef"],
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

export function trimNode(node: SceneNode): FigmaSceneNode {
  const { type } = node;
  let trimmedNode!: FigmaSceneNode;

  if (isNodeVisible(node)) {
    switch (type) {
      case NodeTypes.FRAME:
      case NodeTypes.INSTANCE:
      case NodeTypes.COMPONENT:
        trimmedNode = trimFrameNode(node);
        break;
      case NodeTypes.GROUP:
        trimmedNode = trimGroupNode(node);
        break;

      default:
        // @ts-ignore - To do for now until I finish the other types
        trimmedNode = node;
    }
  }
  return trimmedNode;
}

function trimFrameNode(
  node: FrameNode | ComponentNode | InstanceNode
): FigmaFrameNode {
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

export function addRefToOriginalNode(originalNode: SceneNode) {
  return function innerHelper(node: FigmaSceneNode, root = true) {
    let targetNode: SceneNode;
    const { id } = node;
    if (root) {
      targetNode = originalNode;
    } else {
      // @ts-ignore - todo: fix this
      targetNode = originalNode.findOne?.((child) => child.id === id);
    }

    if (ACCEPTED_KEYS.CHILDREN in node) {
      node.children = node.children.map((child) => innerHelper(child, false));
    }

    return { ...node, originalRef: targetNode };
  };
}
