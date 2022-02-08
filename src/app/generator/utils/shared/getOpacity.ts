import { getTailwindOpacityMap } from "../tailwind-config-parser";

const opacityMap = getTailwindOpacityMap();

export default function getOpacityClass(
  opacity: number,
  token: string
): string {
  const opacityClass = opacityMap.has(opacity)
    ? `${token}${opacityMap.get(opacity)}`
    : `${token}[${Number(opacity).toFixed(2)}]`;
  return opacityClass;
}
