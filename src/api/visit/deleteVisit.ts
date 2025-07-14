import appConfig from "@/configs/app.config";
import { Delete } from "..";

export const deleteVisit = (id: string) =>
  Delete<void, void>(
    `${appConfig.BACKEND_URL}/${appConfig.apiPrefix}/${appConfig.apiVersion1}/visits/${id}`
  );
