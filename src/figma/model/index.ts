export interface FigmaFrameNode {
  type: "FRAME";
  name: string;

  layoutMode: "NONE" | "HORIZONTAL" | "VERTICAL";
  primaryAxisSizingMode: "FIXED" | "AUTO";
  counterAxisSizingMode: "FIXED" | "AUTO";
  primaryAxisAlignItems: "MIN" | "MAX" | "CENTER" | "SPACE_BETWEEN";
  counterAxisAlignItems: "MIN" | "MAX" | "CENTER";
  layoutAlign: "MIN" | "CENTER" | "MAX" | "STRETCH" | "INHERIT";

  itemSpacing: number;
  layoutGrow: number;
  autoLayout: boolean;
  constraints: Constraints;

  fills: Array<Paint>;
  strokes: Array<Paint>;
  strokeWeight: number;
  opacity: number;
  effects: Array<Effect>;

  width: number;
  height: number;

  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;

  cornerRadius: number;
  topLeftRadius: number;
  topRightRadius: number;
  bottomLeftRadius: number;
  bottomRightRadius: number;

  children: Array<any>;
}

export interface FigmaGroupNode {
  type: "GROUP";
  name: string;

  fills: Array<Paint>;
  strokes: Array<Paint>;
  strokeWeight: number;
  opacity: number;
  effects: Array<Effect>;

  layoutAlign: "MIN" | "CENTER" | "MAX" | "STRETCH" | "INHERIT";
  layoutMode: "NONE" | "HORIZONTAL" | "VERTICAL";
  primaryAxisSizingMode: "FIXED" | "AUTO";
  counterAxisSizingMode: "FIXED" | "AUTO";
  primaryAxisAlignItems: "MIN" | "MAX" | "CENTER" | "SPACE_BETWEEN";
  counterAxisAlignItems: "MIN" | "MAX" | "CENTER";

  itemSpacing: number;
  layoutGrow: number;
  constraints: Constraints;

  cornerRadius: number;
  topLeftRadius: number;
  topRightRadius: number;
  bottomLeftRadius: number;
  bottomRightRadius: number;

  width: number;
  height: number;

  children: Array<any>;
}
