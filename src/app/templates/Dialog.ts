import { TemplateIds } from ".";
import { CloseDialogAction } from "../core/ActionTypes";
import { BaseTemplate } from "../core/BaseTemplate";
import connect from "../core/Connect";
import { IDialogState, IState } from "../core/Store";

class Dialog extends BaseTemplate<IMarkupProps> {
  getTemplateId() {
    return TemplateIds.Dialog;
  }

  renderDialogContent(content: string[]) {
    const contentNode: HTMLDivElement | null =
      this.templateNode.querySelector(".dialog-content");

    if (contentNode) {
      const fragment = new DocumentFragment();
      const contentHTML = content
        .map((item) => `<p class="text-xs">${item}</p><hr class="my-1" />`)
        .join("");

      const wrapperDiv = document.createElement("div");
      wrapperDiv.innerHTML = contentHTML;

      fragment.appendChild(wrapperDiv);
      contentNode.appendChild(fragment);
    }
  }

  initCloseButton() {
    const { dispatch } = this.props;
    const dismissNode: HTMLDivElement | null =
      this.templateNode.querySelector(".warning-close");

    dismissNode?.addEventListener("click", () => {
      dispatch?.(new CloseDialogAction());
    });
  }

  renderDialogTitle(title: string) {
    const titleNode: HTMLHeadingElement | null =
      this.templateNode.querySelector(".dialog-title");

    if (titleNode) {
      titleNode.innerHTML = title;
    }
  }

  render() {
    const {
      dialog: { title, content },
    } = this.props;

    this.renderDialogTitle(title);
    this.renderDialogContent(content);

    this.initCloseButton();
  }
}

interface IMarkupProps {
  dialog: IDialogState;
}

const mapStateToProps = ({ dialog }: IState) => ({
  dialog,
});

export default connect(mapStateToProps)(Dialog);
