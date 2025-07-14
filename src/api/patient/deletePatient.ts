import appConfig from "@/configs/app.config";
import { Delete } from "..";

export const deletePatient = (id: string) =>
  Delete<void, void>(
    `${appConfig.BACKEND_URL}/${appConfig.apiPrefix}/${appConfig.apiVersion1}/patients/${id}`
  );
