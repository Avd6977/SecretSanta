import Bottle from "bottlejs";
import { ApiService } from "../services/ApiService";
import { ParticipantImportService } from "../services/ParticipantImportService";
import { AxiosHttpProvider } from "./http/AxiosHttpProvider";

export let bottle;

const init = () => {
  bottle = new Bottle();
  bottle.service("HttpProvider", AxiosHttpProvider);
  bottle.service("ApiService", ApiService, "HttpProvider");
  bottle.service(
    "ParticipantImportService",
    ParticipantImportService,
    "ApiService"
  );
};

export const reload = () => init();

init();
