export enum TemplateIds {
  Body = "body",
  NoSelection = "no-frame",
}

const getTemplateClass = (id: TemplateIds) => {
  let templateClass: any;

  switch (id) {
    case TemplateIds.NoSelection:
      templateClass = require("./NoSelection").default;
      break;
    default:
      break;
  }
  return templateClass;
};

export default getTemplateClass;
