import { TemplateIds } from ".";
import { BaseTemplate } from "../core/BaseTemplate";
import connect, { IProps } from "../core/Connect";
import { IState } from "../core/Store";
import hljs from "highlight.js/lib/core";
import xml from "highlight.js/lib/languages/xml";
import "highlight.js/styles/github-dark.css";
import { zip } from "../generator";
import { saveAs } from "file-saver";
import { OpenDialogAction } from "../core/ActionTypes";

hljs.registerLanguage("xml", xml);

class Markup extends BaseTemplate<IMarkupProps> {
  getTemplateId() {
    return TemplateIds.Markup;
  }

  shouldComponentUpdate(nextProps: IProps<IMarkupProps>) {
    return (
      nextProps.data !== this.props.data ||
      nextProps.selectedFrame !== this.props.selectedFrame ||
      nextProps.warnings !== this.props.warnings
    );
  }

  initCopyToClipboard(markup: string) {
    const copyButton = this.templateNode.querySelector(
      ".clipboard-button"
    ) as HTMLButtonElement;

    if (copyButton) {
      copyButton.addEventListener("click", () => {
        const textArea = document.createElement("textarea");
        textArea.value = markup;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
        copyButton.textContent = "Copied!";
        copyButton.classList.add("bg-green-400", "w-24", "text-white");
        copyButton.classList.remove(
          "w-36",
          "bg-gray-200",
          "text-gray-800",
          "hover:bg-gray-300"
        );

        setTimeout(() => {
          copyButton.textContent = "Copy to Clipboard";
          copyButton.classList.remove("bg-green-400", "w-24", "text-white");
          copyButton.classList.add(
            "w-36",
            "bg-gray-200",
            "text-gray-800",
            "hover:bg-gray-300"
          );
        }, 3000);
      });
    }
  }

  initDownloadButton() {
    const downloadButton = this.templateNode.querySelector(
      ".download-button"
    ) as HTMLButtonElement;

    if (downloadButton) {
      downloadButton.addEventListener("click", () => {
        zip.getZip().then((content: Blob) => {
          saveAs(content, "FigGen-Export.zip");
        });
      });
    }
  }

  addWarningListener() {
    const { dispatch, warnings } = this.props;

    const warningTriggerNode: HTMLDivElement | null =
      this.templateNode.querySelector(".warning-trigger");

    if (warningTriggerNode) {
      if (!warnings.length) {
        warningTriggerNode.classList.add("hidden");
      } else {
        warningTriggerNode.addEventListener("click", () => {
          dispatch(
            new OpenDialogAction({
              title:
                "Generated markup may not be perfect due to one or more of the following reasons:",
              content: warnings,
            })
          );
        });
      }
    }
  }

  render() {
    const { data, selectedFrame } = this.props;

    const markupNode: HTMLDivElement | null =
      this.templateNode.querySelector(".markup-container");

    if (markupNode) {
      const code = hljs.highlightAuto(data);
      markupNode.innerHTML = code.value;

      this.initCopyToClipboard(data);
      this.initDownloadButton();
    }

    const selectedFrameNode: HTMLDivElement | null =
      this.templateNode.querySelector(".current-frame");

    if (selectedFrameNode) {
      selectedFrameNode.innerHTML = `<b>Current Frame:</b> ${selectedFrame}`;
    }

    this.addWarningListener();
  }
}

interface IMarkupProps {
  data: string;
  selectedFrame: string;
  warnings: string[];
}

const mapStateToProps = ({
  markup: { data, warnings },
  selectedFrame,
}: IState) => ({
  data,
  selectedFrame,
  warnings,
});

export default connect(mapStateToProps)(Markup);
