import { TemplateIds } from ".";
import { BaseTemplate } from "../core/BaseTemplate";
import connect from "../core/Connect";
import { IState } from "../core/Store";

class ErrorView extends BaseTemplate<IErrorProps> {
  getTemplateId() {
    return TemplateIds.Error;
  }

  getErrorMessage() {
    const { error } = this.props;

    if (error) {
      return error;
    }

    return "Something went wrong";
  }

  render() {
    const errorMessage = this.getErrorMessage();

    const errorNode: HTMLHeadingElement | null =
      this.templateNode.querySelector(".error-msg");

    if (errorNode) {
      errorNode.textContent = errorMessage;
    }
  }
}

interface IErrorProps {
  error: string;
}

const mapStateToProps = ({ markup: { error } }: IState) => ({
  error,
});

export default connect(mapStateToProps)(ErrorView);
