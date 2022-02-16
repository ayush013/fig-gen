import { NodeTypes } from "../../../figma/constants";
import {
  FigmaFrameNode,
  FigmaGroupNode,
  FigmaSceneNode,
  FigmaTextNode,
} from "../../../figma/model";
import { IntermediateNode } from "./intermediate-node";
import { getTailwindMaxWidthMap } from "../shared/tailwindConfigParser";
import getParentNodeById from "../shared/getParentNodeById";
import getSpacingClass from "../shared/getSpacing";
import { IAppActions, SetWarningAction } from "../../core/ActionTypes";

const maxWidthMap = getTailwindMaxWidthMap();

const MAX_WIDTH_TOKEN = "max-w-";
const WIDTH_TOKEN = "w-";
const HEIGHT_TOKEN = "h-";

export default function addDimensionClasses(
  intermediateNode: IntermediateNode,
  dispatch: (action: IAppActions) => void
): IntermediateNode {
  const node: FigmaSceneNode = intermediateNode.getNode();

  const {
    parent: { id: parentId },
  } = node;

  const parentNode = getParentNodeById(parentId);

  handleWidthTransform(node, intermediateNode, parentNode, dispatch);

  handleHeightTransform(node, intermediateNode, parentNode, dispatch);

  return intermediateNode;
}

const handleWidthTransform = (
  node: FigmaSceneNode,
  intermediateNode: IntermediateNode,
  parentNode: FigmaFrameNode | FigmaGroupNode | undefined,
  dispatch: (action: IAppActions) => void
) => {
  const { type, parent, width } = node;

  switch (type) {
    case NodeTypes.FRAME:
      {
        const { autoLayout } = node;

        if (applyMaxWidthToRootNode(parent, intermediateNode, width)) {
          break;
        }

        if (autoLayout) {
          if (parentNode && parentNode.type === NodeTypes.FRAME) {
            const { layoutMode: parentLayoutMode } = parentNode;

            if (hasFixedWidth(node, parentLayoutMode)) {
              intermediateNode.addClass(getSpacingClass(width, WIDTH_TOKEN));

              dispatch(
                new SetWarningAction(
                  `Layer Name: ${node.name} - has fixed width, consider using 'Fill Container'/'Hug Contents' as constraint`
                )
              );

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
        if (parentNode && parentNode.type === NodeTypes.FRAME) {
          const { layoutMode: parentLayoutMode } = parentNode;

          if (textHasFixedWidth(node, parentLayoutMode)) {
            intermediateNode.addClass(getSpacingClass(width, WIDTH_TOKEN));

            dispatch(
              new SetWarningAction(
                `Layer Name: ${node.name} - has fixed width, consider using 'Fill Container'/'Hug Contents' as constraint`
              )
            );
            break;
          }

          if (textHasFullWidth(node, parentLayoutMode)) {
            intermediateNode.addClass(`${WIDTH_TOKEN}full`);
            break;
          }
        }
      }
      break;

    case NodeTypes.VECTOR:
      {
        const { width } = node;

        // todo
      }
      break;
  }
};

const handleHeightTransform = (
  node: FigmaSceneNode,
  intermediateNode: IntermediateNode,
  parentNode: FigmaFrameNode | FigmaGroupNode | undefined,
  dispatch: (action: IAppActions) => void
) => {
  const { type, height } = node;

  switch (type) {
    case NodeTypes.FRAME:
      {
        const { autoLayout } = node;
        if (autoLayout) {
          if (parentNode && parentNode.type === NodeTypes.FRAME) {
            const { layoutMode: parentLayoutMode } = parentNode;

            if (hasFixedHeight(node, parentLayoutMode)) {
              intermediateNode.addClass(getSpacingClass(height, HEIGHT_TOKEN));

              dispatch(
                new SetWarningAction(
                  `Layer Name: ${node.name} - has fixed height, consider using 'Fill Container'/'Hug Contents' as constraint`
                )
              );

              break;
            }

            if (hasFullHeight(node, parentLayoutMode)) {
              intermediateNode.addClass(`${HEIGHT_TOKEN}full`);
              break;
            }
          }
        }
      }
      break;

    case NodeTypes.TEXT:
      {
        if (parentNode && parentNode.type === NodeTypes.FRAME) {
          const { layoutMode: parentLayoutMode } = parentNode;

          if (textHasFixedHeight(node, parentLayoutMode)) {
            intermediateNode.addClass(getSpacingClass(height, HEIGHT_TOKEN));

            dispatch(
              new SetWarningAction(
                `Layer Name: ${node.name} - has fixed height, consider using 'Fill Container'/'Hug Contents' as constraint`
              )
            );
            break;
          }
        }
      }
      break;

    case NodeTypes.VECTOR:
      {
        const { width } = node;

        // todo
      }
      break;
  }
};

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

function textHasFixedWidth(
  node: FigmaTextNode,
  parentLayoutMode: "VERTICAL" | "HORIZONTAL" | "NONE"
): boolean {
  const { layoutAlign, layoutGrow, textAutoResize } = node;
  if (
    ((parentLayoutMode === "VERTICAL" && layoutAlign === "INHERIT") ||
      (parentLayoutMode === "HORIZONTAL" && layoutGrow === 0)) &&
    (textAutoResize === "NONE" || textAutoResize === "HEIGHT")
  ) {
    return true;
  }
  return false;
}

function textHasFullWidth(
  node: FigmaTextNode,
  parentLayoutMode: "VERTICAL" | "HORIZONTAL" | "NONE"
): boolean {
  const { layoutAlign, layoutGrow, textAutoResize } = node;
  if (
    ((parentLayoutMode === "VERTICAL" && layoutAlign === "STRETCH") ||
      (parentLayoutMode === "HORIZONTAL" && layoutGrow === 1)) &&
    (textAutoResize === "WIDTH_AND_HEIGHT" || textAutoResize === "HEIGHT")
  ) {
    return true;
  }
  return false;
}

function textHasFixedHeight(
  node: FigmaTextNode,
  parentLayoutMode: "VERTICAL" | "HORIZONTAL" | "NONE"
): boolean {
  const { layoutAlign, layoutGrow, textAutoResize } = node;
  if (
    ((parentLayoutMode === "VERTICAL" && layoutGrow === 0) ||
      (parentLayoutMode === "HORIZONTAL" && layoutAlign === "INHERIT")) &&
    textAutoResize === "NONE"
  ) {
    return true;
  }
  return false;
}

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

function hasFullHeight(
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
    (layoutMode === "HORIZONTAL" && counterAxisSizingMode === "FIXED") ||
    (layoutMode === "VERTICAL" && primaryAxisSizingMode === "FIXED")
  ) {
    return (
      (parentLayoutMode === "VERTICAL" && layoutGrow === 1) ||
      (parentLayoutMode === "HORIZONTAL" && layoutAlign === "STRETCH")
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

function hasFixedHeight(
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
    (layoutMode === "HORIZONTAL" && counterAxisSizingMode === "FIXED") ||
    (layoutMode === "VERTICAL" && primaryAxisSizingMode === "FIXED")
  ) {
    return (
      (parentLayoutMode === "VERTICAL" && layoutGrow === 0) ||
      (parentLayoutMode === "HORIZONTAL" && layoutAlign === "INHERIT")
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
