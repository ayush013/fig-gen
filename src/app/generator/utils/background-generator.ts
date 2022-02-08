import { figmaRGBToHex } from "@figma-plugin/helpers";
import { NodeTypes } from "../../../figma/constants";
import { FigmaSceneNode } from "../../../figma/model";
import { IntermediateNode } from "./intermediate-node";
import {
  getTailwindColorMap,
  getTailwindOpacityMap,
} from "./tailwind-config-parser";

const colorMap = getTailwindColorMap();
const opacityMap = getTailwindOpacityMap();

const colorKeys = Array.from(colorMap).map(([key, _]) => key);
const findNearestColor = require("nearest-color").from(colorKeys);

const BACKGROUND_TOKEN = "bg-";

const OPACITY_TOKEN = "bg-opacity-";

export default function addBackgroundClasses(
  intermediateNode: IntermediateNode
): IntermediateNode {
  const node: FigmaSceneNode = intermediateNode.getNode();

  const { type } = node;

  switch (type) {
    case NodeTypes.FRAME:
    case NodeTypes.GROUP:
      {
        const { fills } = node;

        if (fills.length > 0) {
          const currentColor = fills[0];

          switch (currentColor.type) {
            case "SOLID":
              {
                const { color, opacity } = currentColor;

                const colorHex = figmaRGBToHex(color);
                const nearestColorResult = findNearestColor(colorHex);
                const bgColorValue = colorMap.get(nearestColorResult);

                intermediateNode.addClass(`${BACKGROUND_TOKEN}${bgColorValue}`);

                if (opacity !== undefined && opacity !== 1) {
                  const opacityClass = opacityMap.has(opacity)
                    ? `${OPACITY_TOKEN}${opacityMap.get(opacity)}`
                    : `${OPACITY_TOKEN}[${Number(opacity).toFixed(2)}]`;
                  intermediateNode.addClass(`${opacityClass}`);
                }
              }
              break;
          }
        }
      }

      break;
  }

  return intermediateNode;
}
