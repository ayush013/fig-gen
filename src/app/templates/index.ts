export enum TemplateIds {
  NoSelection = "no-frame",
  Error = "error",
  Markup = "markup",
  InProgress = "in-progress",
  Dialog = "dialog",
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
    case TemplateIds.Dialog:
      delete require.cache[require.resolve("./Dialog")];
      templateClass = require("./Dialog").default;
      break;
    default:
      break;
  }
  return templateClass;
};

export default getTemplateClass;
