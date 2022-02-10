import { NodeTypes } from "../../../figma/constants";
import {
  FigmaFrameNode,
  FigmaGroupNode,
  FigmaSceneNode,
  FigmaTextNode,
} from "../../../figma/model";
import { IntermediateNode } from "./intermediate-node";

const BOX_SHADOW_TOKEN = "drop-shadow-";

export default function addEffectClasses(
  intermediateNode: IntermediateNode
): IntermediateNode {
  const node: FigmaSceneNode = intermediateNode.getNode();

  const { type } = node;

  switch (type) {
    case NodeTypes.FRAME:
    case NodeTypes.GROUP:
      {
        applyEffectsFromArray(node, intermediateNode, BOX_SHADOW_TOKEN);
      }
      break;
  }

  return intermediateNode;
}

function applyEffectsFromArray(
  node: FigmaFrameNode | FigmaGroupNode | FigmaTextNode,
  intermediateNode: IntermediateNode,
  token: string
): void {
  const { effects } = node;

  if (effects.length > 0) {
    effects.forEach((effect) => {
      const { type } = effect;

      switch (type) {
        case "DROP_SHADOW":
          {
            intermediateNode.addClass(getShadowClass(effect, token));
          }
          break;
      }
    });
  }
}

function getShadowClass(effect: DropShadowEffect, token: string): string {
  const { color, offset, radius } = effect;
  const { r, g, b, a } = color;
  const { x, y } = offset;

  const colorString = `rgba(${getFloatOrIntegerString(
    r
  )},${getFloatOrIntegerString(g)},${getFloatOrIntegerString(
    b
  )},${getFloatOrIntegerString(a)})`;

  const offsetString = `${getFloatOrIntegerString(
    x
  )}px_${getFloatOrIntegerString(y)}px`;

  const shadowString = `${token}[${offsetString}_${getFloatOrIntegerString(
    radius
  )}px_${colorString}]`;

  return shadowString;
}

const getFloatOrIntegerString = (value: number): string => {
  if (Number.isInteger(value)) {
    return value.toString();
  }

  return Number(value).toFixed(1);
};
