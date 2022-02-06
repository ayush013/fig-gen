import { FigmaSceneNode } from "../../figma/model";
import { FigmaIntermediateNode } from "./model";

export default function generate(node: FigmaSceneNode): void {
  const intermediateNode = nodePipeLine()(node);
}

// Write a function pipe which composes functions with the same arity.
// pipe(f, g, h) = x => h(g(f(x)))
// pipe(f, g) = x => g(f(x))
// pipe(f) = x => f(x)

const nodePipeLine =
  (...fns: Function[]) =>
  (node: FigmaSceneNode) => {
    return fns.reduce(
      (acc, fn, index) => (index === 0 ? fn(node) : fn(node, acc)),
      node
    );
  };
