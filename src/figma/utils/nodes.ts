import { isPageNode } from "@figma-plugin/helpers";

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

export function supportsAutoLayout() {}

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
      return trimFrameNode(node as FrameNode);
  }

  return {};
}

function trimFrameNode(node: any, convertedObj = {}) {
  for (const key of [
    ...ACCEPTED_KEYS.COMMON,
    ...ACCEPTED_KEYS.FRAME,
    ACCEPTED_KEYS.CHILDREN,
  ]) {
    if (node[key]) {
      if (key === ACCEPTED_KEYS.CHILDREN) {
        // @ts-ignore
        convertedObj[key] = node[key].map((child) => trimNode(child));
      } else {
        // @ts-ignore
        convertedObj[key] = node[key];
      }
    }
  }

  return convertedObj;
}

export const pipe =
  (...functions: Function[]) =>
  (args: any) =>
    functions.reduce((arg, fn) => fn(arg), args);
