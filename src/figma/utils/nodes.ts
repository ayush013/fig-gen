import { isPageNode } from "@figma-plugin/helpers";
import { ACCEPTED_KEYS, NodeTypes, VECTOR_EXPORT_OPTIONS } from "../constants";
import {
  FigmaFrameNode,
  FigmaGroupNode,
  FigmaSceneNode,
  FigmaTextNode,
  FigmaVectorNode,
} from "../model";

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

function isExportable(node: CompositeSceneNode): boolean {
  const { name, exportSettings } = node;
  const hasExportFlagInName = name.toLowerCase().includes("export=true");
  const hasValidExportSettings = exportSettings.some((setting) =>
    setting.format.match(/(svg|png|jpg)/i)
  );

  return hasExportFlagInName || hasValidExportSettings;
}

type CompositeSceneNode = SceneNode & {
  originalRef: SceneNode;
};

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
      (node as FigmaFrameNode | FigmaGroupNode).children = (
        node as FigmaFrameNode | FigmaGroupNode
      ).children.map((child: FigmaSceneNode) => innerHelper(child, false));
    }

    return { ...node, originalRef: targetNode };
  };
}

// Node trimming related functions

export async function trimNode(
  node: CompositeSceneNode
): Promise<FigmaSceneNode | undefined> {
  let trimmedNode: FigmaSceneNode | undefined;

  if (isNodeVisible(node)) {
    if (isExportable(node)) {
      trimmedNode = await trimVectorNode(node);
    } else {
      trimmedNode = await trimNodeBasedOnType(node);
    }
  }
  return trimmedNode;
}

async function trimNodeBasedOnType(
  node: CompositeSceneNode
): Promise<FigmaSceneNode | undefined> {
  const { type } = node;

  switch (type) {
    case NodeTypes.FRAME:
    case NodeTypes.INSTANCE:
    case NodeTypes.COMPONENT:
      return await trimFrameNode(node);

    case NodeTypes.GROUP:
      return await trimGroupNode(node);

    case NodeTypes.TEXT:
      return await trimTextNode(node);

    case NodeTypes.VECTOR:
    case NodeTypes.RECTANGLE:
    case NodeTypes.ELLIPSE:
    case NodeTypes.LINE:
    case NodeTypes.POLYGON:
    case NodeTypes.STAR:
      return await trimVectorNode(node);
    default:
      return Promise.resolve(undefined);
  }
}

async function trimFrameNode(
  node: FrameNode | ComponentNode | InstanceNode
): Promise<FigmaFrameNode> {
  const trimmedNode: FigmaFrameNode = {} as FigmaFrameNode;
  for (const key of [
    ...ACCEPTED_KEYS.COMMON,
    ...ACCEPTED_KEYS.FRAME,
    ACCEPTED_KEYS.CHILDREN,
  ]) {
    if (key in node) {
      if (key === ACCEPTED_KEYS.CHILDREN) {
        // @ts-ignore - todo: fix this
        trimmedNode[key] = await trimChildNodes(node[key]);
      } else {
        // @ts-ignore - todo: fix this
        trimmedNode[key] = node[key];
      }

      if (key === "fills") {
        filterVisibleFills(node, trimmedNode);
      }

      if (key === "effects") {
        filterVisibleEffects(node, trimmedNode);
      }

      if (key === "strokes") {
        filterVisibleStrokes(node, trimmedNode);
      }
    }
  }

  if (supportsAutoLayout(node)) {
    trimmedNode.autoLayout = true;
  }

  trimmedNode.type = NodeTypes.FRAME;

  return trimmedNode;
}

async function trimGroupNode(node: GroupNode): Promise<FigmaGroupNode> {
  const trimmedNode: FigmaGroupNode = {} as FigmaGroupNode;
  for (const key of [
    ...ACCEPTED_KEYS.COMMON,
    ...ACCEPTED_KEYS.GROUP,
    ACCEPTED_KEYS.CHILDREN,
  ]) {
    if (key in node) {
      if (key === ACCEPTED_KEYS.CHILDREN) {
        // @ts-ignore - todo: fix this
        trimmedNode[key] = await trimChildNodes(node[key]);
      } else {
        // @ts-ignore - todo: fix this
        trimmedNode[key] = node[key];
      }
    }
  }

  return trimmedNode;
}

async function trimChildNodes(
  children: CompositeSceneNode[]
): Promise<(FigmaSceneNode | undefined)[]> {
  const trimmedChildren = await Promise.all(
    children.map(async (child: CompositeSceneNode) => await trimNode(child))
  );

  return trimmedChildren.filter((child) => !!child);
}

async function trimTextNode(node: TextNode): Promise<FigmaTextNode> {
  const trimmedNode: FigmaTextNode = {} as FigmaTextNode;
  for (const key of [...ACCEPTED_KEYS.COMMON, ...ACCEPTED_KEYS.TEXT]) {
    if (key in node) {
      // @ts-ignore - todo: fix this
      if (node[key] !== figma.mixed) {
        // @ts-ignore - todo: fix this
        trimmedNode[key] = node[key];

        if (key === "fills") {
          filterVisibleFills(node, trimmedNode);
        }
      } else {
        // @ts-ignore - todo: fix this
        trimmedNode[key] = undefined;
      }
    }
  }

  return trimmedNode;
}

function filterVisibleFills(
  node: TextNode | FrameNode | ComponentNode | InstanceNode,
  trimmedNode: FigmaTextNode | FigmaFrameNode
) {
  const { fills } = node;

  if (Array.isArray(fills)) {
    trimmedNode.fills = fills.filter((fill) => fill.visible);
  }
}

function filterVisibleEffects(
  node: TextNode | FrameNode | ComponentNode | InstanceNode,
  trimmedNode: FigmaTextNode | FigmaFrameNode
) {
  const { effects } = node;

  if (Array.isArray(effects)) {
    trimmedNode.effects = effects.filter((effect) => effect.visible);
  }
}

function filterVisibleStrokes(
  node: TextNode | FrameNode | ComponentNode | InstanceNode,
  trimmedNode: FigmaFrameNode
) {
  const { strokes } = node;

  if (Array.isArray(strokes)) {
    trimmedNode.strokes = strokes.filter((stroke) => stroke.visible);
  }
}

async function trimVectorNode(
  node: CompositeSceneNode
): Promise<FigmaVectorNode> {
  const trimmedNode: FigmaVectorNode = {} as FigmaVectorNode;

  let exportformat = getExportFormatFromSettings(node);
  if (!exportformat) {
    exportformat = getExportFormatFromName(node);
  }

  const { format } =
    VECTOR_EXPORT_OPTIONS[exportformat as keyof typeof VECTOR_EXPORT_OPTIONS];

  try {
    trimmedNode.data = await node.originalRef.exportAsync({
      format,
    } as ExportSettings);
    trimmedNode.format = format;

    for (const key of [...ACCEPTED_KEYS.COMMON, ...ACCEPTED_KEYS.VECTOR]) {
      if (key in node) {
        // @ts-ignore - todo: fix this
        trimmedNode[key] = node[key];
      }
    }

    trimmedNode.type = NodeTypes.VECTOR;

    return trimmedNode;
  } catch (e) {
    throw new Error("Failed to export node");
  }
}

const DEFAULT_EXPORT_FORMAT = "PNG";

function getExportFormatFromName(node: CompositeSceneNode): string {
  const { name } = node;

  const formatMatch = name.match(/format=(svg|png|jpg)/i);
  let exportformat = formatMatch
    ? formatMatch[1].toUpperCase()
    : DEFAULT_EXPORT_FORMAT;

  if (!Object.keys(VECTOR_EXPORT_OPTIONS).includes(exportformat)) {
    exportformat = DEFAULT_EXPORT_FORMAT;
  }
  return exportformat;
}

function getExportFormatFromSettings(
  node: CompositeSceneNode
): string | undefined {
  const { exportSettings } = node;
  const format = exportSettings
    .filter(({ format }) => format.match(/(svg|png|jpg)/i))
    .map(({ format }) => format)?.[0];

  return format;
}
