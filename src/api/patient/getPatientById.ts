import { get } from "..";
import appConfig from "@/configs/app.config";

export const getPatientById = (patientId: string) =>
  get<any, void>(
    `${appConfig.BACKEND_URL}/${appConfig.apiPrefix}/${appConfig.apiVersion1}/patients/${patientId}`
  );
