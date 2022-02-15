import { NodeTypes } from "../../../figma/constants";
import { FigmaSceneNode } from "../../../figma/model";
import { IAppActions, SetWarningAction } from "../../core/ActionTypes";
import getColorClass from "../shared/getColor";
import { IntermediateNode } from "./intermediate-node";

const BORDER_TOKEN = "border-";

export default function addBorderClasses(
  intermediateNode: IntermediateNode,
  dispatch: (action: IAppActions) => void
): IntermediateNode {
  const node: FigmaSceneNode = intermediateNode.getNode();

  const { type } = node;

  switch (type) {
    case NodeTypes.FRAME:
      {
        const { strokes, strokeWeight, dashPattern } = node;

        if (strokes.length) {
          const stroke = strokes[0];

          if (stroke.type === "SOLID") {
            const { color } = stroke;

            intermediateNode.addClass(getColorClass(color, BORDER_TOKEN));

            if (strokeWeight === 1) {
              intermediateNode.addClass("border");
            } else {
              intermediateNode.addClass(`${BORDER_TOKEN}[${strokeWeight}]px`);
            }

            if (dashPattern.length) {
              intermediateNode.addClass(`${BORDER_TOKEN}dashed`);
            }
          } else {
            dispatch(
              new SetWarningAction(
                `Layer Name: ${node.name} - Border of ${stroke.type} type is not supported yet.`
              )
            );
          }
        }
      }
      break;
  }

  return intermediateNode;
}
