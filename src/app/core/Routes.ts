import { TemplateIds } from "../templates";
import getStore from "./Store";

const getCurrentRoutes = (): TemplateIds[] => {
  const {
    markup: { data, inProgress, error },
    dialog,
  } = getStore().state;

  const currentRoutes = [];

  if (data && !inProgress && !error) {
    currentRoutes.push(TemplateIds.Markup);
  } else if (inProgress) {
    currentRoutes.push(TemplateIds.InProgress);
  } else if (error) {
    currentRoutes.push(TemplateIds.Error);
  } else if (!data && !inProgress && !error) {
    currentRoutes.push(TemplateIds.NoSelection);
  }

  if (dialog) {
    currentRoutes.push(TemplateIds.Dialog);
  }

  return currentRoutes;
};

export default getCurrentRoutes;
