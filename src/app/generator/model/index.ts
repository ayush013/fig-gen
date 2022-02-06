export interface FigmaIntermediateNode {
  tag: string;
  selfContained: boolean;
  className: Set<string>;
  children?: FigmaIntermediateNode[];
  attributes?: Map<string, Set<string>>;
}
