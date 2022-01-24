import { TemplateIds } from ".";
import { BaseTemplate } from "../core/BaseTemplate";

export default class Error extends BaseTemplate<null> {
  getTemplateId() {
    return TemplateIds.Error;
  }
}
