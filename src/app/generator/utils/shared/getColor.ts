import { figmaRGBToHex } from "@figma-plugin/helpers";
import { getTailwindColorMap } from "../tailwind-config-parser";

const colorMap = getTailwindColorMap();

const colorKeys = Array.from(colorMap).map(([key, _]) => key);
const findNearestColor = require("nearest-color").from(colorKeys);

export default function getColorClass(color: RGB, token: string): string {
  const colorHex = figmaRGBToHex(color);
  const nearestColorResult = findNearestColor(colorHex);
  const colorMapValue = colorMap.get(nearestColorResult);

  return `${token}${colorMapValue}`;
}
