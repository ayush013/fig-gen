import { NodeTypes } from "../../../figma/constants";
import { FigmaSceneNode } from "../../../figma/model";
import { IntermediateNode } from "./intermediate-node";
import getColorClass from "./shared/getColor";
import getOpacityClass from "./shared/getOpacity";

const BACKGROUND_TOKEN = "bg-";
const OPACITY_TOKEN = "bg-opacity-";

export default function addBackgroundClasses(
  intermediateNode: IntermediateNode
): IntermediateNode {
  const node: FigmaSceneNode = intermediateNode.getNode();

  const { type } = node;

  switch (type) {
    case NodeTypes.FRAME:
    case NodeTypes.GROUP:
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
          }
        }
      }

      break;
  }

  return intermediateNode;
}
