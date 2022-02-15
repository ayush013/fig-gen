import { figmaRGBToWebRGB } from "@figma-plugin/helpers";
import { NodeTypes } from "../../../figma/constants";
import {
  FigmaFrameNode,
  FigmaGroupNode,
  FigmaSceneNode,
} from "../../../figma/model";
import { IAppActions, SetWarningAction } from "../../core/ActionTypes";
import { IntermediateNode } from "./intermediate-node";

const BOX_SHADOW_TOKEN = "shadow-";

export default function addEffectClasses(
  intermediateNode: IntermediateNode,
  dispatch: (action: IAppActions) => void
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
    case NodeTypes.TEXT:
      {
        const { effects } = node;
        if (effects.length > 0) {
          dispatch(
            new SetWarningAction(
              `Layer Name: ${node.name} - Text effects are not supported yet.`
            )
          );
        }
      }
      break;
  }

  return intermediateNode;
}

function applyEffectsFromArray(
  node: FigmaFrameNode | FigmaGroupNode,
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
            intermediateNode.addClass(getShadowClass(effect, token, false));
          }
          break;
        case "INNER_SHADOW":
          {
            intermediateNode.addClass(getShadowClass(effect, token, true));
          }
          break;
        case "LAYER_BLUR":
          {
            const { radius } = effect;
            intermediateNode.addClass(`blur-[${radius}px]`);
          }
          break;
        case "BACKGROUND_BLUR":
          {
            const { radius } = effect;
            intermediateNode.addClass(`backdrop-blur-[${radius}px]`);
          }
          break;
      }
    });
  }
}

function getShadowClass(
  effect: DropShadowEffect | InnerShadowEffect,
  token: string,
  inset: boolean
): string {
  const { color, offset, radius, spread } = effect;
  const webColor = figmaRGBToWebRGB(color);
  const [r, g, b, a] = webColor;
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
  )}px_${spread ? getFloatOrIntegerString(spread) : 0}px_${colorString}${
    inset ? "_inset" : ""
  }]`;

  return shadowString;
}

const getFloatOrIntegerString = (value: number): string => {
  if (Number.isInteger(value)) {
    return value.toString();
  }

  return Number(value).toFixed(1);
};
