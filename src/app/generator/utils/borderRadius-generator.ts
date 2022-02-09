import { NodeTypes } from "../../../figma/constants";
import { FigmaSceneNode } from "../../../figma/model";
import { IntermediateNode } from "./intermediate-node";
import { getTailwindBorderRadiusMap } from "./tailwind-config-parser";

enum BorderRadiusTokens {
  ALL = "rounded-",
  TOP = "rounded-t-",
  LEFT = "rounded-l-",
  RIGHT = "rounded-r-",
  BOTTOM = "rounded-b-",
  TOP_LEFT = "rounded-tl-",
  TOP_RIGHT = "rounded-tr-",
  BOTTOM_LEFT = "rounded-bl-",
  BOTTOM_RIGHT = "rounded-br-",
}

const borderRadiusMap = getTailwindBorderRadiusMap();

export default function addBorderRadiusClasses(
  intermediateNode: IntermediateNode
): IntermediateNode {
  const node: FigmaSceneNode = intermediateNode.getNode();

  const { type } = node;

  switch (type) {
    case NodeTypes.FRAME:
      {
        const {
          topLeftRadius,
          topRightRadius,
          bottomLeftRadius,
          bottomRightRadius,
        } = node;

        const hasSameRadius =
          topLeftRadius === topRightRadius &&
          topLeftRadius === bottomLeftRadius &&
          topLeftRadius === bottomRightRadius &&
          topLeftRadius !== 0;

        const hasSameTopRadius =
          topLeftRadius && topRightRadius && topLeftRadius === topRightRadius;

        const hasSameBottomRadius =
          bottomLeftRadius &&
          bottomRightRadius &&
          bottomLeftRadius === bottomRightRadius;

        if (hasSameRadius) {
          intermediateNode.addClass(
            getBorderRadiusClass(topLeftRadius, BorderRadiusTokens.ALL)
          );
        } else if (hasSameTopRadius) {
          intermediateNode.addClass(
            getBorderRadiusClass(topLeftRadius, BorderRadiusTokens.TOP)
          );
        } else if (hasSameBottomRadius) {
          intermediateNode.addClass(
            getBorderRadiusClass(bottomLeftRadius, BorderRadiusTokens.BOTTOM)
          );
        } else {
          topLeftRadius &&
            intermediateNode.addClass(
              getBorderRadiusClass(topLeftRadius, BorderRadiusTokens.TOP_LEFT)
            );
          topRightRadius &&
            intermediateNode.addClass(
              getBorderRadiusClass(topRightRadius, BorderRadiusTokens.TOP_RIGHT)
            );
          bottomLeftRadius &&
            intermediateNode.addClass(
              getBorderRadiusClass(
                bottomLeftRadius,
                BorderRadiusTokens.BOTTOM_LEFT
              )
            );
          bottomRightRadius &&
            intermediateNode.addClass(
              getBorderRadiusClass(
                bottomRightRadius,
                BorderRadiusTokens.BOTTOM_RIGHT
              )
            );
        }
      }
      break;
  }

  return intermediateNode;
}

const getBorderRadiusClass = (spacing: number, token: string) => {
  return borderRadiusMap.has(spacing)
    ? `${token}${borderRadiusMap.get(spacing)}`
    : `${token}[${Number(spacing / 16).toFixed(2)}rem]`;
};
