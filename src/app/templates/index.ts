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
      delete require.cache[require.resolve("./NoSelection")];
      templateClass = require("./NoSelection").default;
      break;
    case TemplateIds.Error:
      delete require.cache[require.resolve("./ErrorView")];
      templateClass = require("./ErrorView").default;
      break;
    case TemplateIds.InProgress:
      delete require.cache[require.resolve("./InProgress")];
      templateClass = require("./InProgress").default;
      break;
    case TemplateIds.Markup:
      delete require.cache[require.resolve("./Markup")];
      templateClass = require("./Markup").default;
      break;
    default:
      break;
  }
  return templateClass;
};

export default getTemplateClass;
