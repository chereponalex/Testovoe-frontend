import appConfig from "@/configs/app.config";
import { put } from "..";
import { CreatePatientPayload } from "@/@types/patient";

export const updatePatient = (
  data: Partial<CreatePatientPayload>,
  id: string
) =>
  put<CreatePatientPayload, any>(
    `${appConfig.BACKEND_URL}/${appConfig.apiPrefix}/${appConfig.apiVersion1}/patients/${id}`,
    { ...data }
  );
