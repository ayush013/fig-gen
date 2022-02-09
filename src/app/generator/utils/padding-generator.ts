import { NodeTypes } from "../../../figma/constants";
import { FigmaSceneNode } from "../../../figma/model";
import { IntermediateNode } from "./intermediate-node";
import getSpacingClass from "./shared/getSpacing";

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
              getSpacingClass(padding[0], PaddingTokens.EQUAL)
            );
        } else if (hasEqualXPadding && hasEqualYPadding) {
          padding[1] &&
            intermediateNode.addClass(
              getSpacingClass(padding[1], PaddingTokens.X)
            );
          padding[0] &&
            intermediateNode.addClass(
              getSpacingClass(padding[0], PaddingTokens.Y)
            );
        } else if (hasEqualXPadding) {
          padding[1] &&
            intermediateNode.addClass(
              getSpacingClass(padding[1], PaddingTokens.X)
            );
          paddingTop &&
            intermediateNode.addClass(
              getSpacingClass(paddingTop, PaddingTokens.TOP)
            );
          paddingBottom &&
            intermediateNode.addClass(
              getSpacingClass(paddingBottom, PaddingTokens.BOTTOM)
            );
        } else if (hasEqualYPadding) {
          padding[0] &&
            intermediateNode.addClass(
              getSpacingClass(padding[0], PaddingTokens.Y)
            );
          paddingLeft &&
            intermediateNode.addClass(
              getSpacingClass(paddingLeft, PaddingTokens.LEFT)
            );
          paddingRight &&
            intermediateNode.addClass(
              getSpacingClass(paddingRight, PaddingTokens.RIGHT)
            );
        } else {
          paddingLeft &&
            intermediateNode.addClass(
              getSpacingClass(paddingLeft, PaddingTokens.LEFT)
            );
          paddingRight &&
            intermediateNode.addClass(
              getSpacingClass(paddingRight, PaddingTokens.RIGHT)
            );
          paddingTop &&
            intermediateNode.addClass(
              getSpacingClass(paddingTop, PaddingTokens.TOP)
            );
          paddingBottom &&
            intermediateNode.addClass(
              getSpacingClass(paddingBottom, PaddingTokens.BOTTOM)
            );
        }
      }

      break;
  }

  return intermediateNode;
};

export default addPaddingClasses;
