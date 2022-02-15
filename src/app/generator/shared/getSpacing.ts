import { getTailwindSpacingMap } from "./tailwindConfigParser";

const spacingMap = getTailwindSpacingMap();

const getSpacingClass = (spacing: number, token: string) => {
  const spacingInRem = spacing / 16;
  return spacingMap.has(spacing)
    ? `${token}${spacingMap.get(spacing)}`
    : `${token}[${
        Number.isInteger(spacingInRem)
          ? spacingInRem
          : Number(spacingInRem).toFixed(2)
      }rem]`;
};

export default getSpacingClass;
