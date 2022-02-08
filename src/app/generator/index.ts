import { NodeTypes } from "../../figma/constants";
import { FigmaSceneNode } from "../../figma/model";
import { pipe } from "../../figma/utils/pipe";
import { SetMarkupAction } from "../core/ActionTypes";
import getStore from "../core/Store";
import getHTMLScaffold from "./bundle/html-scaffold";
import generateZip from "./bundle/zip-files";
import addImageToZip from "./utils/image-generator";
import generateIntermediateNode, {
  IntermediateNode,
} from "./utils/intermediate-node";
import addLayoutClasses from "./utils/layout-generator";
import addPaddingClasses from "./utils/padding-generator";

export const zip = generateZip();

export default function generateAndExport(node: FigmaSceneNode) {
  const intermediateNode = generate(node);

  console.log(intermediateNode);

  const markup = getHTMLScaffold(
    convertIntermediateNodeToString(intermediateNode)
  );

  zip.addHTML("index.html", markup);

  // zip.getZip().then(function (content: Blob) {
  //   console.log(content);
  //   saveAs(content, "example.zip");
  // });

  getStore().dispatch(new SetMarkupAction(markup));
}

const intermediateNodeGeneratorFn = pipe(
  generateIntermediateNode,
  addLayoutClasses,
  addPaddingClasses,
  addImageToZip
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
  const open = `<${intermediateNode.tag}${classNameString}${attributesString}>`;

  const close = `</${intermediateNode.tag}>`;

  let children = "";

  if (intermediateNode.children) {
    children = `${intermediateNode.children
      .map(convertIntermediateNodeToString)
      .join("")}`;
  }
  return `${open}${children}${close}`;
}
