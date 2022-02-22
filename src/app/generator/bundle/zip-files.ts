import * as JSZip from "jszip";

// Creates a zip instance and returns access to add image, html or download zip
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
