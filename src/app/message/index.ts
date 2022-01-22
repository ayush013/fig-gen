export enum MessageTypes {
  CANCEL = "CANCEL",
}

export const figmaPostMessage = (
  type: MessageTypes,
  payload?: IMessagePayload<any>
): void => {
  parent.postMessage({ pluginMessage: { type, payload } }, "*");
};

interface IMessagePayload<T> {
  data: T;
}
