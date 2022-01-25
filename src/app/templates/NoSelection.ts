import { TemplateIds } from ".";
import { BaseTemplate } from "../core/BaseTemplate";
import connect from "../core/Connect";
import { IState } from "../core/Store";

class NoSelection extends BaseTemplate<NoSelectionProps> {
  getTemplateId() {
    return TemplateIds.NoSelection;
  }
}

const mapStateToProps = ({ markup: { data, inProgress, error } }: IState) => ({
  unselected: !data && !inProgress && !error,
});

export default connect(mapStateToProps)(NoSelection);

interface NoSelectionProps {
  unselected: boolean;
}
