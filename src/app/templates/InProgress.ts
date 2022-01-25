import { TemplateIds } from ".";
import { BaseTemplate } from "../core/BaseTemplate";

export default class InProgress extends BaseTemplate<null> {
  getTemplateId() {
    return TemplateIds.InProgress;
  }
}
