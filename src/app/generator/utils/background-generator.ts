import { NodeTypes } from "../../../figma/constants";
import { FigmaFrameNode, FigmaSceneNode } from "../../../figma/model";
import { IntermediateNode } from "./intermediate-node";
import getColorClass from "../shared/getColor";
import getOpacityClass from "../shared/getOpacity";
import { IAppActions, SetWarningAction } from "../../core/ActionTypes";

const BACKGROUND_TOKEN = "bg-";
const OPACITY_TOKEN = "bg-opacity-";

export default function addBackgroundClasses(
  intermediateNode: IntermediateNode,
  dispatch: (action: IAppActions) => void
): IntermediateNode {
  const node: FigmaSceneNode = intermediateNode.getNode();

  const { type } = node;

  switch (type) {
    case NodeTypes.FRAME:
      {
        const { fills } = node;

        if (fills.length > 0) {
          const currentColor = fills[0];

          switch (currentColor.type) {
            case "SOLID":
              {
                const { color, opacity } = currentColor;

                intermediateNode.addClass(
                  getColorClass(color, BACKGROUND_TOKEN)
                );

                if (opacity !== undefined && opacity !== 1) {
                  intermediateNode.addClass(
                    getOpacityClass(opacity, OPACITY_TOKEN)
                  );
                }
              }
              break;
            case "IMAGE": {
              dispatch(
                new SetWarningAction(
                  `Layer Name: ${node.name} - Image as a background is not supported yet.`
                )
              );
              break;
            }
          }
          // todo "IMAGE" and "GRADIENT"
          // todo "GROUP"

          checkForMultipleFills(fills, dispatch, node);
        }
      }

      break;
  }

  return intermediateNode;
}

function checkForMultipleFills(
  fills: Paint[],
  dispatch: (action: any) => void,
  node: FigmaFrameNode
) {
  if (fills.length > 1) {
    dispatch(
      new SetWarningAction(
        `Layer Name: ${node.name} - Multiple fills are not supported.`
      )
    );
  }
}
