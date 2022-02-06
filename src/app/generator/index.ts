import { NodeTypes } from "../../figma/constants";
import { FigmaSceneNode } from "../../figma/model";
import { pipe } from "../../figma/utils/pipe";
import generateIntermediateNode, {
  IntermediateNode,
} from "./utils/intermediate-node";

export default function generateAndExport(node: FigmaSceneNode) {
  const intermediateNode = generate(node);

  console.log(intermediateNode);
}

const intermediateNodeGeneratorFn = pipe(generateIntermediateNode);

function generate(node: FigmaSceneNode): IntermediateNode {
  const intermediateNode: IntermediateNode = intermediateNodeGeneratorFn(node);

  if (node.type === NodeTypes.FRAME || node.type === NodeTypes.GROUP) {
    if (node.children) {
      intermediateNode.children = node.children.map((child) => generate(child));
    }
  }

  return intermediateNode;
}
