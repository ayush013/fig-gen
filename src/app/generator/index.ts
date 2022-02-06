import { NodeTypes } from "../../figma/constants";
import { FigmaSceneNode } from "../../figma/model";
import { pipe } from "../../figma/utils/pipe";
import { SetMarkupAction } from "../core/ActionTypes";
import getStore from "../core/Store";
import generateIntermediateNode, {
  IntermediateNode,
} from "./utils/intermediate-node";
import addLayoutClasses from "./utils/layout-generator";

export default function generateAndExport(node: FigmaSceneNode) {
  const intermediateNode = generate(node);

  console.log(intermediateNode);
  const markup = convertIntermediateNodeToString(intermediateNode);

  getStore().dispatch(new SetMarkupAction(markup));
}

const intermediateNodeGeneratorFn = pipe(
  generateIntermediateNode,
  addLayoutClasses
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
    classNameString = `class="${Array.from(intermediateNode.className).join(
      " "
    )}"`;
  }
  const open = `<${intermediateNode.tag} ${classNameString} >`;

  const close = `</${intermediateNode.tag}>`;

  let children = "";

  if (intermediateNode.children) {
    children = `${intermediateNode.children
      .map(convertIntermediateNodeToString)
      .join("")}`;
  }
  return `${open}${children}${close}`;
}
