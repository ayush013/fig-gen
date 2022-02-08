import * as JSZip from "jszip";

export default function generateZip() {
  const zipInstance = new JSZip();

  return {
    addImage: (fileName: string, fileContent: Uint8Array) => {
      zipInstance.folder("assets")?.file(fileName, fileContent);
    },
    addHTML: (fileName: string, fileContent: string): void => {
      zipInstance.file(fileName, fileContent);
    },
    getZip: (): Promise<Blob> => {
      return zipInstance.generateAsync({ type: "blob" });
    },
  };
}
