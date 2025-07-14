import { Visit } from "@/@types/visit";
import { get } from "..";
import appConfig from "@/configs/app.config";

export const getAllVisitsByPatient = (patientId: string) =>
  get<Visit[], void>(
    `${appConfig.BACKEND_URL}/${appConfig.apiPrefix}/${appConfig.apiVersion1}/patients/${patientId}/visits`
  );
