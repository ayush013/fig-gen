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
