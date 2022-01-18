import "./style.scss";

const loadApp = () => {
  const create = document.getElementById("create");
  create &&
    create.addEventListener("click", () => {
      const textbox = document.getElementById("count");
      const count = parseInt((textbox as any).value, 10);
      parent.postMessage(
        { pluginMessage: { type: "create-rectangles", count } },
        "*"
      );
    });

  const cancel = document.getElementById("cancel");
  cancel &&
    cancel.addEventListener("click", () => {
      parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
    });
};

loadApp();
