export interface FigmaFrameNode {
  type: "FRAME";
  name: string;
  id: string;

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
  rotation: number;

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

  originalRef: SceneNode;
}

export interface FigmaGroupNode {
  type: "GROUP";
  name: string;
  id: string;

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
  rotation: number;

  children: Array<any>;

  originalRef: SceneNode;
}

export interface FigmaTextNode {
  type: "TEXT";
  name: string;
  id: string;

  textAlignHorizontal: "LEFT" | "CENTER" | "RIGHT" | "JUSTIFIED";
  textAlignVertical: "TOP" | "CENTER" | "BOTTOM";
  textAutoResize: "NONE" | "WIDTH_AND_HEIGHT" | "HEIGHT";
  paragraphIndent: number;
  paragraphSpacing: number;
  characters: string;
  fontSize: number;
  fontName: FontName;
  textCase: "ORIGINAL" | "UPPER" | "LOWER" | "TITLE";
  textDecoration: "NONE" | "UNDERLINE" | "STRIKETHROUGH";
  letterSpacing: LetterSpacing;
  lineHeight: LineHeight;

  fills: Array<Paint>;
  strokes: Array<Paint>;
  strokeWeight: number;
  opacity: number;
  effects: Array<Effect>;

  width: number;
  height: number;
  rotation: number;

  layoutAlign: "MIN" | "CENTER" | "MAX" | "STRETCH" | "INHERIT";
  layoutGrow: number;
  constraints: Constraints;
}

export interface FigmaVectorNode {
  type: "VECTOR";
  name: string;
  id: string;

  data: Uint8Array;
  mimeType: string;

  width: number;
  height: number;
  rotation: number;

  originalRef: SceneNode;
}

export type FigmaSceneNode =
  | FigmaFrameNode
  | FigmaGroupNode
  | FigmaTextNode
  | FigmaVectorNode;
