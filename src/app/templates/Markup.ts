import { TemplateIds } from ".";
import { BaseTemplate } from "../core/BaseTemplate";
import connect from "../core/Connect";
import { IState } from "../core/Store";
import hljs from "highlight.js/lib/core";
import xml from "highlight.js/lib/languages/xml";
import "highlight.js/styles/github-dark.css";
const beautify = require("beautify");

hljs.registerLanguage("xml", xml);

class Markup extends BaseTemplate<IMarkupProps> {
  getTemplateId() {
    return TemplateIds.Markup;
  }

  getMarkup(): string {
    const { data } = this.props;

    if (data) {
      return beautify(data, { format: "html" });
    }

    return "";
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
        copyButton.classList.add("bg-green-500", "w-24");
        copyButton.classList.remove("w-36", "bg-blue-400");

        setTimeout(() => {
          copyButton.textContent = "Copy to Clipboard";
          copyButton.classList.remove("bg-green-500", "w-24");
          copyButton.classList.add("w-36", "bg-blue-400");
        }, 3000);
      });
    }
  }

  render() {
    const markup = this.getMarkup();

    const markupNode: HTMLDivElement | null =
      this.templateNode.querySelector(".markup-container");

    if (markupNode) {
      const code = hljs.highlightAuto(markup);
      markupNode.innerHTML = code.value;

      this.initCopyToClipboard(markup);
    }

    const selectedFrameNode: HTMLDivElement | null =
      this.templateNode.querySelector(".current-frame");

    const { selectedFrame } = this.props;

    if (selectedFrameNode) {
      selectedFrameNode.innerHTML = `<b>Current Frame:</b> ${selectedFrame}`;
    }
  }
}

interface IMarkupProps {
  data: string;
  selectedFrame: string;
}

const mapStateToProps = ({ markup: { data }, selectedFrame }: IState) => ({
  data,
  selectedFrame,
});

export default connect(mapStateToProps)(Markup);
