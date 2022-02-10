import { getTailwindSpacingMap } from "../tailwind-config-parser";

const paddingMap = getTailwindSpacingMap();

const getSpacingClass = (spacing: number, token: string) => {
  const spacingInRem = spacing / 16;
  return paddingMap.has(spacing)
    ? `${token}${paddingMap.get(spacing)}`
    : `${token}[${
        Number.isInteger(spacingInRem)
          ? spacingInRem
          : Number(spacingInRem).toFixed(2)
      }rem]`;
};

export default getSpacingClass;
