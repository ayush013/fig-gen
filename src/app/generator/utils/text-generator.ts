import { NodeTypes } from "../../../figma/constants";
import { FigmaSceneNode } from "../../../figma/model";
import { IntermediateNode } from "./intermediate-node";
import getColorClass from "./shared/getColor";
import getOpacityClass from "./shared/getOpacity";
import { getTailwindFontSizeMap } from "./tailwind-config-parser";

const fontSizeMap = getTailwindFontSizeMap();

const TEXT_TOKEN = "text-";
const TEXT__OPACITY_TOKEN = `${TEXT_TOKEN}opacity-`;

export default function addTextAndStyles(
  intermediateNode: IntermediateNode
): IntermediateNode {
  const node: FigmaSceneNode = intermediateNode.getNode();

  const { type } = node;

  switch (type) {
    case NodeTypes.TEXT:
      {
        const {
          characters,
          textCase,
          textDecoration,
          fontSize,
          textAlignHorizontal,
          fills,
        } = node;

        intermediateNode.addContent(characters);

        textCase &&
          textCase !== "ORIGINAL" &&
          intermediateNode.addClass(getTextCaseClass(textCase));

        textDecoration &&
          textDecoration !== "NONE" &&
          intermediateNode.addClass(getTextDecorationClass(textDecoration));

        textAlignHorizontal &&
          textAlignHorizontal !== "LEFT" &&
          intermediateNode.addClass(getTextAlignClass(textAlignHorizontal));

        if (fontSize !== 16) {
          const fontSizeClass = getFontSizeClass(fontSize);
          intermediateNode.addClass(`${fontSizeClass}`);
        }

        if (fills.length > 0) {
          const currentColor = fills[0];

          intermediateNode.addClass(getTextColorClass(currentColor));
          intermediateNode.addClass(getTextOpacityClass(currentColor));
        }
      }

      break;
  }

  return intermediateNode;
}

const getTextCaseClass = (textCase: string): string => {
  switch (textCase) {
    case "UPPER":
      return "uppercase";
    case "LOWER":
      return "lowercase";
    case "TITLE":
      return "capitalize";
    default:
      return "";
  }
};

const getTextDecorationClass = (textDecoration: string): string => {
  switch (textDecoration) {
    case "UNDERLINE":
      return "underline";
    case "STRIKETHROUGH":
      return "line-through";
    default:
      return "";
  }
};

const getTextAlignClass = (textAlignHorizontal: string): string => {
  switch (textAlignHorizontal) {
    case "LEFT":
      return "text-left";
    case "CENTER":
      return "text-center";
    case "RIGHT":
      return "text-right";
    case "JUSTIFIED":
      return "text-justify";
    default:
      return "";
  }
};

const getTextColorClass = (currentColor: Paint): string => {
  switch (currentColor.type) {
    case "SOLID": {
      const { color } = currentColor;

      return getColorClass(color, TEXT_TOKEN);
    }
    default:
      return "";
  }
};

const getFontSizeClass = (fontSize: number): string => {
  const fontSizeInRem = fontSize / 16;
  const fontSizeClass = fontSizeMap.has(fontSize)
    ? `${TEXT_TOKEN}${fontSizeMap.get(fontSize)}`
    : `${TEXT_TOKEN}[${
        Number.isInteger(fontSizeInRem)
          ? fontSizeInRem
          : Number(fontSizeInRem).toFixed(2)
      }rem]`;
  return fontSizeClass;
};

const getTextOpacityClass = (currentColor: Paint): string => {
  const { opacity } = currentColor;

  if (opacity !== undefined && opacity !== 1) {
    return getOpacityClass(opacity, TEXT__OPACITY_TOKEN);
  }

  return "";
};
