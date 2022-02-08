import { NodeTypes } from "../../../figma/constants";
import { FigmaSceneNode } from "../../../figma/model";

export class IntermediateNode {
  private __node: FigmaSceneNode;
  tag: HTMLTags;
  selfContained: boolean;
  children: IntermediateNode[] | undefined;
  className: Set<string>;
  attributes: Map<string, string>;

  constructor(node: FigmaSceneNode) {
    this.__node = node;
    this.tag = tagMapper(node.type);
    this.selfContained = selfContainedMapper(this.tag);
    this.className = new Set();
    this.attributes = new Map();
  }

  getNode(): FigmaSceneNode {
    return this.__node;
  }

  addClass(className: string) {
    this.className.add(className);
  }

  addAttribute(attribute: string, value: string) {
    this.attributes.set(attribute, value);
  }
}

const tagMapper = (type: "FRAME" | "GROUP" | "TEXT" | "VECTOR"): HTMLTags => {
  switch (type) {
    case NodeTypes.TEXT:
      return HTMLTags.P;
    case NodeTypes.FRAME:
    case NodeTypes.GROUP:
      return HTMLTags.DIV;
    case NodeTypes.VECTOR:
      return HTMLTags.IMG;
    default:
      return HTMLTags.DIV;
  }
};

const selfContainedMapper = (tag: HTMLTags) => {
  switch (tag) {
    case HTMLTags.IMG:
      return true;
    default:
      return false;
  }
};

enum HTMLTags {
  DIV = "div",
  P = "p",
  IMG = "img",
}

const generateIntermediateNode = (node: FigmaSceneNode): IntermediateNode => {
  return new IntermediateNode(node);
};

export default generateIntermediateNode;
