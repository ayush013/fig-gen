const tailwindConfig = require("../../../../tailwind.config.js");

const { theme } = tailwindConfig;

export const getTailwindSpacingMap = () => {
  const { spacing }: { [key: string]: string } = theme;

  const parsedEntries = Object.entries(spacing)
    .filter(([_, value]) => value.includes("rem"))
    .map(([key, value]) => ({
      value: key,
      key: Number(value.replace("rem", "")) * 16,
    }));

  let spacingMap = new Map();

  parsedEntries.forEach(({ key, value }) => spacingMap.set(key, value));

  return spacingMap;
};

export const getTailwindOpacity = () => {
  return theme.opacity;
};
