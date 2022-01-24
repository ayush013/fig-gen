import { TemplateIds } from ".";
import { BaseTemplate } from "../core/BaseTemplate";

export default class NoSelection extends BaseTemplate<null> {
  getTemplateId() {
    return TemplateIds.NoSelection;
  }
}
