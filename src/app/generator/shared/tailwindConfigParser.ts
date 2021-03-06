const tailwindConfig = require("#tailwind");

const { theme } = tailwindConfig;

export const getTailwindSpacingMap = () => {
  const { spacing }: { [key: string]: string } = theme;

  const parsedEntries = Object.entries(spacing)
    .filter(([_, value]) => value.includes("rem"))
    .map(([key, value]) => ({
      value: key,
      key: Number(value.replace("rem", "")) * 16,
    }));

  const spacingMap = new Map();

  parsedEntries.forEach(({ key, value }) => spacingMap.set(key, value));

  return spacingMap;
};

export const getTailwindOpacityMap = () => {
  const { opacity }: { [key: string]: string } = theme;

  const parsedEntries = Object.entries(opacity).map(([key, value]) => ({
    value: key,
    key: Number(value),
  }));

  const opacityMap = new Map();

  parsedEntries.forEach(({ key, value }) => opacityMap.set(key, value));

  return opacityMap;
};

export const getTailwindColorMap = () => {
  const colors = require("tailwindcss/colors");

  const colorMap = new Map();

  Object.entries(Object.getOwnPropertyDescriptors(colors))
    .filter(([_, decriptor]) => decriptor.hasOwnProperty("value"))
    .forEach(([color, decriptor]) => {
      const { value } = decriptor;
      if (typeof value === "object") {
        Object.entries(value).forEach(([key, value]) => {
          colorMap.set(value, `${color}-${key}`);
        });
      } else {
        (value as string).startsWith?.("#") && colorMap.set(value, color);
      }
    });

  return colorMap;
};

export const getTailwindFontSizeMap = () => {
  const { fontSize }: { [key: string]: Object } = theme;

  const parsedEntries = Object.entries(fontSize).map(([key, value]) => ({
    value: key,
    key: Number(value[0].replace("rem", "")) * 16,
  }));

  const fontSizeMap = new Map();

  parsedEntries.forEach(({ key, value }) => fontSizeMap.set(key, value));

  return fontSizeMap;
};

export const getTailwindBorderRadiusMap = () => {
  const { borderRadius }: { [key: string]: string } = theme;

  const parsedEntries = Object.entries(borderRadius)
    .filter(([_, value]) => value.includes("rem"))
    .map(([key, value]) => ({
      value: key,
      key: Number(value.replace("rem", "")) * 16,
    }));

  const borderRadiusMap = new Map();

  parsedEntries.forEach(({ key, value }) => borderRadiusMap.set(key, value));

  return borderRadiusMap;
};

export const getTailwindMaxWidthMap = () => {
  const { maxWidth, screens } = theme;

  const parsedScreenWidthEntries = Object.entries(screens).map(
    ([key, value]) => ({
      value: `screen-${key}`,
      key: Number((value as string).replace("px", "")),
    })
  );

  const stub = () => {};

  const parsedMaxWidthEntries = Object.entries(
    maxWidth({ breakpoints: stub, theme: stub })
  )
    .filter(([_, value]) => (value as string).includes("rem"))
    .map(([key, value]) => ({
      value: key,
      key: Number((value as string).replace("rem", "")) * 16,
    }));

  const maxWidthMap = new Map();

  [...parsedScreenWidthEntries, ...parsedMaxWidthEntries].forEach(
    ({ key, value }) => maxWidthMap.set(key, value)
  );

  return maxWidthMap;
};

export const getFontWeightMap = () => {
  const { fontWeight }: { [key: string]: string } = theme;

  const parsedEntries = Object.entries(fontWeight);

  const fontWeightMap = new Map();

  parsedEntries.forEach(([key, value]) => fontWeightMap.set(key, value));

  return fontWeightMap;
};
