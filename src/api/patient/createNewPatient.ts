import appConfig from "@/configs/app.config";
import { post } from "..";
import { CreatePatientPayload } from "@/@types/patient";

export const createNewPatient = (data: CreatePatientPayload) =>
  post<CreatePatientPayload, any>(
    `${appConfig.BACKEND_URL}/${appConfig.apiPrefix}/${appConfig.apiVersion1}/patients`,
    data
  );
