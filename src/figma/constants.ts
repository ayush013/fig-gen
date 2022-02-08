export enum NodeTypes {
  FRAME = "FRAME",
  COMPONENT = "COMPONENT",
  INSTANCE = "INSTANCE",
  GROUP = "GROUP",
  TEXT = "TEXT",

  VECTOR = "VECTOR",
  RECTANGLE = "RECTANGLE",
  ELLIPSE = "ELLIPSE",
  LINE = "LINE",
  POLYGON = "POLYGON",
  STAR = "STAR",
}

export const ACCEPTED_KEYS = {
  CHILDREN: "children",
  COMMON: ["type", "name", "originalRef", "id"],
  FRAME: [
    "layoutMode",
    "primaryAxisSizingMode",
    "counterAxisSizingMode",
    "primaryAxisAlignItems",
    "counterAxisAlignItems",
    "paddingLeft",
    "paddingRight",
    "paddingTop",
    "paddingBottom",
    "itemSpacing",
    "fills",
    "strokes",
    "strokeWeight",
    "cornerRadius",
    "topLeftRadius",
    "topRightRadius",
    "bottomLeftRadius",
    "bottomRightRadius",
    "opacity",
    "effects",
    "rotation",
    "width",
    "height",
    "layoutAlign",
    "layoutGrow",
    "constraints",
  ],
  GROUP: [
    "fills",
    "strokes",
    "strokeWeight",
    "opacity",
    "effects",
    "layoutAlign",
    "layoutMode",
    "primaryAxisSizingMode",
    "counterAxisSizingMode",
    "primaryAxisAlignItems",
    "counterAxisAlignItems",
    "itemSpacing",
    "layoutGrow",
    "constraints",
    "cornerRadius",
    "topLeftRadius",
    "topRightRadius",
    "bottomLeftRadius",
    "bottomRightRadius",
    "width",
    "height",
    "rotation",
  ],
  TEXT: [
    "textAlignHorizontal",
    "textAlignVertical",
    "textAutoResize",
    "paragraphIndent",
    "paragraphSpacing",
    "characters",
    "fontSize",
    "fontName",
    "textCase",
    "textDecoration",
    "letterSpacing",
    "lineHeight",
    "fills",
    "strokes",
    "strokeWeight",
    "opacity",
    "effects",
    "rotation",
    "width",
    "height",
    "layoutAlign",
    "layoutGrow",
    "constraints",
  ],
  VECTOR: [
    "width",
    "height",
    "rotation",
    "effects",
    "layoutAlign",
    "constraints",
    "layoutGrow",
  ],
};

export const VECTOR_EXPORT_OPTIONS = {
  SVG: {
    mimeType: "image/svg+xml",
    format: "SVG",
  },
  PNG: {
    mimeType: "image/png",
    format: "PNG",
  },
  JPG: {
    mimeType: "image/jpeg",
    format: "JPG",
  },
};