import { NodeTypes } from "../../../figma/constants";
import { FigmaSceneNode } from "../../../figma/model";
import { IntermediateNode } from "./intermediate-node";
import { getTailwindFontSizeMap } from "./tailwind-config-parser";

const fontSizeMap = getTailwindFontSizeMap();

const FONT_SIZE_TOKEN = "text-";

export default function addTextAndStyles(
  intermediateNode: IntermediateNode
): IntermediateNode {
  const node: FigmaSceneNode = intermediateNode.getNode();

  const { type } = node;

  switch (type) {
    case NodeTypes.TEXT:
      {
        const { characters, textCase, textDecoration, fontSize } = node;

        intermediateNode.addContent(characters);

        textCase &&
          textCase !== "ORIGINAL" &&
          intermediateNode.addClass(getTextCaseClass(textCase));

        textDecoration &&
          textDecoration !== "NONE" &&
          intermediateNode.addClass(getTextDecorationClass(textDecoration));

        if (fontSize !== 16) {
          const opacityClass = fontSizeMap.has(fontSize)
            ? `${FONT_SIZE_TOKEN}${fontSizeMap.get(fontSize)}`
            : `${FONT_SIZE_TOKEN}[${Number(fontSize).toFixed(2)}]`;
          intermediateNode.addClass(`${opacityClass}`);
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
