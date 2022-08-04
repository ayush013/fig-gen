import { TemplateIds } from ".";
import { CloseDialogAction } from "../core/ActionTypes";
import { BaseTemplate } from "../core/BaseTemplate";
import connect, { IProps } from "../core/Connect";
import { IDialogState, IState } from "../core/Store";

class Dialog extends BaseTemplate<IMarkupProps> {
  getTemplateId() {
    return TemplateIds.Dialog;
  }

  shouldComponentUpdate(nextProps: IProps<IMarkupProps>) {
    return (
      nextProps.dialog.content !== this.props.dialog.content ||
      nextProps.dialog.title !== this.props.dialog.title
    );
  }

  renderDialogContent(content: string[]) {
    const contentNode: HTMLDivElement =
      this.templateNode.querySelector(".dialog-content")!;

    const fragment = new DocumentFragment();
    const contentHTML = content
      .map(
        (item, idx) =>
          `<li class="p-1 ${
            idx % 2 === 0 ? "bg-gray-100" : "bg-transparent"
          }">${item}</li>`
      )
      .join("");

    const wrapperDiv = document.createElement("ul");
    wrapperDiv.classList.add(
      "list-disc",
      "text-xs",
      "font-medium",
      "list-inside"
    );
    wrapperDiv.innerHTML = contentHTML;

    fragment.appendChild(wrapperDiv);
    contentNode.appendChild(fragment);
  }

  initCloseButton() {
    const dismissNode: HTMLDivElement =
      this.templateNode.querySelector(".warning-close")!;

    const containerNode: HTMLDivElement =
      this.templateNode.querySelector(".dialog-body")!;

    dismissNode.addEventListener(
      "click",
      this.animateAndCloseDialog.bind(this, containerNode)
    );
  }

  animateAndCloseDialog = (containerNode: HTMLDivElement) => {
    const { dispatch } = this.props;

    containerNode.animate(
      [
        { transform: "none", opacity: 1 },
        { transform: "translateY(-10px)", opacity: 0 },
      ],
      {
        duration: 300,
        easing: "ease",
      }
    );

    Promise.all(containerNode.getAnimations().map((a) => a.finished)).then(
      dispatch.bind(this, new CloseDialogAction())
    );
  };

  animateDialogEnter = () => {
    const containerNode: HTMLDivElement =
      this.templateNode.querySelector(".dialog-body")!;

    requestAnimationFrame(() => {
      containerNode.animate(
        [
          { transform: "translateY(10px)", opacity: 0 },
          { transform: "none", opacity: 1 },
        ],
        {
          duration: 300,
          easing: "ease",
        }
      );
    });
  };

  renderDialogTitle(title: string) {
    const titleNode: HTMLHeadingElement =
      this.templateNode.querySelector(".dialog-title")!;

    titleNode.innerHTML = title;
  }

  render() {
    const {
      dialog: { title, content },
    } = this.props;

    this.renderDialogTitle(title);
    this.renderDialogContent(content);

    this.animateDialogEnter();

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
