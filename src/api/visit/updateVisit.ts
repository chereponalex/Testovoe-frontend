import appConfig from "@/configs/app.config";
import { put } from "..";
import { Visit } from "@/@types/visit";

export const updateVisit = (data: any, id: string) =>
  put<Visit, void>(
    `${appConfig.BACKEND_URL}/${appConfig.apiPrefix}/${appConfig.apiVersion1}/visits/${id}`,
    { ...data }
  );
