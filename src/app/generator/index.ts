import { NodeTypes } from "../../figma/constants";
import { FigmaSceneNode } from "../../figma/model";
import { pipe } from "../../figma/utils/pipe";
import { SetMarkupAction, SetSelectedFrameAction } from "../core/ActionTypes";
import getStore from "../core/Store";
import getHTMLScaffold from "./bundle/html-scaffold";
import generateZip from "./bundle/zip-files";
import addBackgroundClasses from "./utils/background-generator";
import addBorderClasses from "./utils/border-generator";
import addBorderRadiusClasses from "./utils/borderRadius-generator";
import addDimensionClasses from "./utils/dimensions-generator";
import addEffectClasses from "./utils/effects-generator";
import addImageToZip from "./utils/image-generator";
import generateIntermediateNode, {
  IntermediateNode,
} from "./utils/intermediate-node";
import addLayoutClasses from "./utils/layout-generator";
import addOpacityClasses from "./utils/opacity-generator";
import addPaddingClasses from "./utils/padding-generator";
import addTextAndStyles from "./utils/text-generator";

export const zip = generateZip();
const beautify = require("beautify");

export default function generateAndExport(node: FigmaSceneNode) {
  const intermediateNode = generate(node);

  const markup = beautify(
    getHTMLScaffold(convertIntermediateNodeToString(intermediateNode)),
    { format: "html" }
  );

  zip.addHTML("index.html", markup);

  const store = getStore();

  const { name } = node;

  store.dispatch(new SetMarkupAction(markup));
  store.dispatch(new SetSelectedFrameAction(name));
}

const intermediateNodeGeneratorFn = pipe(
  [
    generateIntermediateNode,
    addLayoutClasses,
    addDimensionClasses,
    addPaddingClasses,
    addOpacityClasses,
    addBackgroundClasses,
    addBorderClasses,
    addBorderRadiusClasses,
    addEffectClasses,
    addTextAndStyles,
    addImageToZip,
  ],
  getStore().dispatch
);

function generate(node: FigmaSceneNode): IntermediateNode {
  const intermediateNode: IntermediateNode = intermediateNodeGeneratorFn(node);

  if (node.type === NodeTypes.FRAME || node.type === NodeTypes.GROUP) {
    if (node.children) {
      intermediateNode.children = node.children.map((child) => generate(child));
    }
  }

  return intermediateNode;
}

function convertIntermediateNodeToString(intermediateNode: IntermediateNode) {
  const { selfContained } = intermediateNode;

  let classNameString = "";
  if (intermediateNode.className.size > 0) {
    classNameString = ` class="${Array.from(intermediateNode.className).join(
      " "
    )}"`;
  }

  let attributesString = "";

  if (intermediateNode.attributes.size > 0) {
    attributesString = ` ${Array.from(intermediateNode.attributes).reduce(
      (acc, [key, value]) => acc.concat(`${key}="${value}" `),
      ""
    )}`;
  }

  let selfContainedToken = "";

  if (selfContained) {
    selfContainedToken = " /";
  }

  const open = `<${intermediateNode.tag}${classNameString}${attributesString}${selfContainedToken}>`;

  const close = selfContained ? "" : `</${intermediateNode.tag}>`;

  let children = "";

  if (intermediateNode.children) {
    children = Array.isArray(intermediateNode.children)
      ? `${intermediateNode.children
          .map(convertIntermediateNodeToString)
          .join("")}`
      : `${intermediateNode.children}`;
  }

  return `${open}${children}${close}`;
}
