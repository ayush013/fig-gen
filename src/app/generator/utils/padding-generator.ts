import { NodeTypes } from "../../../figma/constants";
import { FigmaSceneNode } from "../../../figma/model";
import { IntermediateNode } from "./intermediate-node";
import { getTailwindSpacingMap } from "./tailwind-config-parser";

const paddingMap = getTailwindSpacingMap();

enum PaddingTokens {
  TOP = "pt-",
  BOTTOM = "pb-",
  LEFT = "pl-",
  RIGHT = "pr-",
  X = "px-",
  Y = "py-",
  EQUAL = "p-",
}

const addPaddingClasses = (intermediateNode: IntermediateNode) => {
  const node: FigmaSceneNode = intermediateNode.getNode();

  const { type } = node;

  switch (type) {
    case NodeTypes.FRAME:
      {
        const { paddingTop, paddingRight, paddingBottom, paddingLeft } = node;

        const padding = [paddingTop, paddingRight, paddingBottom, paddingLeft];

        const hasEqualPadding = padding.every((value) => value === padding[0]);
        const hasEqualXPadding = padding[1] === padding[3];
        const hasEqualYPadding = padding[0] === padding[2];

        if (hasEqualPadding) {
          padding[0] &&
            intermediateNode.addClass(
              `${getPaddingDecorator(PaddingTokens.EQUAL, padding[0])}`
            );
        } else if (hasEqualXPadding && hasEqualYPadding) {
          padding[1] &&
            intermediateNode.addClass(
              `${getPaddingDecorator(PaddingTokens.X, padding[1])}`
            );
          padding[0] &&
            intermediateNode.addClass(
              `${getPaddingDecorator(PaddingTokens.Y, padding[0])}`
            );
        } else if (hasEqualXPadding) {
          padding[1] &&
            intermediateNode.addClass(
              `${getPaddingDecorator(PaddingTokens.X, padding[1])}`
            );
          paddingTop &&
            intermediateNode.addClass(
              `${getPaddingDecorator(PaddingTokens.TOP, paddingTop)}`
            );
          paddingBottom &&
            intermediateNode.addClass(
              `${getPaddingDecorator(PaddingTokens.BOTTOM, paddingBottom)}`
            );
        } else if (hasEqualYPadding) {
          padding[0] &&
            intermediateNode.addClass(
              `${getPaddingDecorator(PaddingTokens.Y, padding[0])}`
            );
          paddingLeft &&
            intermediateNode.addClass(
              `${getPaddingDecorator(PaddingTokens.LEFT, paddingLeft)}`
            );
          paddingRight &&
            intermediateNode.addClass(
              `${getPaddingDecorator(PaddingTokens.RIGHT, paddingRight)}`
            );
        } else {
          paddingLeft &&
            intermediateNode.addClass(
              `${getPaddingDecorator(PaddingTokens.LEFT, paddingLeft)}`
            );
          paddingRight &&
            intermediateNode.addClass(
              `${getPaddingDecorator(PaddingTokens.RIGHT, paddingRight)}`
            );
          paddingTop &&
            intermediateNode.addClass(
              `${getPaddingDecorator(PaddingTokens.TOP, paddingTop)}`
            );
          paddingBottom &&
            intermediateNode.addClass(
              `${getPaddingDecorator(PaddingTokens.BOTTOM, paddingBottom)}`
            );
        }
      }

      break;
  }

  return intermediateNode;
};

const getPaddingDecorator = (token: string, padding: number) => {
  return paddingMap.has(padding)
    ? `${token}${paddingMap.get(padding)}`
    : `${token}[${Number(padding / 16).toFixed(2)}rem]`;
};

export default addPaddingClasses;
