export enum MessageTypes {
  CANCEL = "CANCEL",
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
