export enum TemplateIds {
  Body = "body",
  NoSelection = "no-frame",
  Error = "error",
  Markup = "markup",
  SelectedFrame = "selected-frame",
  InProgress = "in-progress",
}

const getTemplateClass = (id: TemplateIds) => {
  let templateClass: any;

  switch (id) {
    case TemplateIds.NoSelection:
      templateClass = require("./NoSelection").default;
      break;
    case TemplateIds.Error:
      templateClass = require("./ErrorView").default;
      break;
    case TemplateIds.InProgress:
      templateClass = require("./InProgress").default;
      break;
    default:
      break;
  }
  return templateClass;
};

export default getTemplateClass;
