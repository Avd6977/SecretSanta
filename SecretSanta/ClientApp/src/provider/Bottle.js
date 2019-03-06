import Bottle from "bottlejs";

export let bottle;

const init = () => {
  bottle = new Bottle();
  bottle.service("HttpProvider", AxiosHttpProvider);
  bottle.service("ApiService", ApiService, "HttpProvider");
};

export const reload = () => init();

init();
