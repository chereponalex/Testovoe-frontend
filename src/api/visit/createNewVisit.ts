import appConfig from "@/configs/app.config";
import { post } from "..";
import { Visit } from "@/@types/visit";

export const createNewVisit = (data: Visit) =>
  post<Visit, Visit>(
    `${appConfig.BACKEND_URL}/${appConfig.apiPrefix}/${appConfig.apiVersion1}/visits`,
    data
  );
