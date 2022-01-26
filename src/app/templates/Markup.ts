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
      return data;
    }

    return "";
  }

  render() {
    const markup = this.getMarkup();

    const markupNode: HTMLDivElement | null =
      this.templateNode.querySelector(".markup-container");

    if (markupNode) {
      const indentedMarkup = beautify(markup, { format: "html" });
      const code = hljs.highlightAuto(indentedMarkup);
      markupNode.innerHTML = code.value;
    }

    const selectedFrameNode: HTMLDivElement | null =
      this.templateNode.querySelector(".current-frame");

    const { selectedFrame } = this.props;

    if (selectedFrameNode) {
      selectedFrameNode.textContent = `Current Frame: ${selectedFrame}`;
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
