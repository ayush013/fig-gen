import { getTailwindSpacingMap } from "../tailwind-config-parser";

const paddingMap = getTailwindSpacingMap();

const getSpacingClass = (spacing: number, token: string) => {
  return paddingMap.has(spacing)
    ? `${token}${paddingMap.get(spacing)}`
    : `${token}[${Number(spacing / 16).toFixed(2)}rem]`;
};

export default getSpacingClass;
