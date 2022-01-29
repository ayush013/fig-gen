export enum MessageTypes {
  CLOSE = "CLOSE",
  ERROR = "ERROR",
  NO_SELECTION = "NO_SELECTION",
  MARKUP_GENERATED = "MARKUP_GENERATED",
  IN_PROGRESS = "IN_PROGRESS",
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
