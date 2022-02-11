import {
  FigmaFrameNode,
  FigmaGroupNode,
  FigmaSceneNode,
} from "../../../figma/model";
import getStore from "../../core/Store";

const getParentNodeById = (
  id: string
): FigmaFrameNode | FigmaGroupNode | undefined => {
  const {
    state: {
      node: { tree },
    },
  } = getStore();

  const _helper = (
    current: FigmaSceneNode | null
  ): FigmaFrameNode | FigmaGroupNode | undefined => {
    if (!current) return;

    if (current.id === id) return current as FigmaFrameNode | FigmaGroupNode;

    if (current.type === "FRAME" || current.type === "GROUP") {
      const { children } = current;
      for (let child of children) {
        const result = _helper(child);
        if (result !== undefined) return result;
      }
    }
    return;
  };

  return _helper(tree);
};

export default getParentNodeById;
