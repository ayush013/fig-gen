import { TemplateIds } from ".";
import { BaseTemplate } from "../core/BaseTemplate";
export default class NoSelection extends BaseTemplate<undefined> {
  getTemplateId() {
    return TemplateIds.NoSelection;
  }
}
