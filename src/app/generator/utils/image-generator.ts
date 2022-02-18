import { zip } from "..";
import { NodeTypes } from "../../../figma/constants";
import { FigmaSceneNode } from "../../../figma/model";
import { IntermediateNode } from "./intermediate-node";

export default function addImageToZip(
  intermediateNode: IntermediateNode
): IntermediateNode {
  const node: FigmaSceneNode = intermediateNode.getNode();

  const { type } = node;

  switch (type) {
    case NodeTypes.VECTOR:
      const { data, format } = node;
      const assetName = `image-${
        Math.random() * 100000
      }.${format.toLocaleLowerCase()}`;
      intermediateNode.addAttribute("src", `./assets/${assetName}`);
      zip.addImage(`${assetName}`, data);
      break;
  }

  return intermediateNode;
}
