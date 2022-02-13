import { TemplateIds } from ".";
import { SetSplashAction } from "../core/ActionTypes";
import { BaseTemplate } from "../core/BaseTemplate";
import connect from "../core/Connect";
import { IState } from "../core/Store";
class NoSelection extends BaseTemplate<ISplashScreenProps> {
  getTemplateId() {
    return TemplateIds.NoSelection;
  }

  render() {
    const { dispatch, splash } = this.props;

    if (splash) {
      setTimeout(() => {
        this.hideSplashScreen();
        dispatch?.(new SetSplashAction());
      }, 1500);
    } else {
      this.hideSplashScreen();
    }
  }

  hideSplashScreen() {
    const splashScreenNode: HTMLHeadingElement | null =
      this.templateNode.querySelector(".splash");

    const landingNode: HTMLHeadingElement | null =
      this.templateNode.querySelector(".landing");

    splashScreenNode?.classList.add("opacity-0");
    landingNode?.classList.remove("opacity-0");
  }
}

interface ISplashScreenProps {
  splash: boolean;
}

const mapStateToProps = ({ splash }: IState) => ({
  splash,
});

export default connect(mapStateToProps)(NoSelection);
