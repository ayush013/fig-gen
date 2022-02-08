import { FigmaSceneNode } from "../model";

export enum MessageTypes {
  CLOSE = "CLOSE",
  ERROR = "ERROR",
  NO_SELECTION = "NO_SELECTION",
  IN_PROGRESS = "IN_PROGRESS",
  NODE_GENERATED = "NODE_GENERATED",
}

export const postMessageToFigma = (
  type: MessageTypes,
  payload?: IMessagePayload<any>
): void => {
  parent.postMessage({ pluginMessage: { type, payload } }, "*");
};

export const postMessageToApp = (
  type: MessageTypes,
  payload?: IMessagePayload<any>
): void => {
  figma.ui.postMessage({ type, payload });
};

interface IMessagePayload<T> {
  data: T;
}

export interface IMessage<T> {
  type: MessageTypes;
  payload: IMessagePayload<T>;
}

interface IMarkupPayload {
  markup: string;
  selectedFrame: string;
}

interface IErrorPayload {
  error: string;
}

export interface INodePayload {
  node: FigmaSceneNode;
}

export class MarkupPayload {
  public data: IMarkupPayload;

  constructor(markup: string, selectedFrame: string) {
    this.data = {
      markup,
      selectedFrame,
    };
  }
}

export class ErrorPayload {
  public data: IErrorPayload;

  constructor(error: string) {
    this.data = {
      error,
    };
  }
}

export class NodePayload {
  public data: INodePayload;

  constructor(node: FigmaSceneNode) {
    this.data = {
      node,
    };
  }
}
