import { Patient } from "@/@types/patient";
import { get } from "..";
import appConfig from "@/configs/app.config";
import { GetPatientsParams, PaginatedResponse } from "@/@types";

export const getAllPatients = (params?: GetPatientsParams) => {
  const queryParams = new URLSearchParams();
  if (params?.page) {
    queryParams.append("page", params.page.toString());
  }
  if (params?.limit) {
    queryParams.append("limit", params.limit.toString());
  }
  if (params?.search) {
    queryParams.append("search", params.search);
  }

  const queryString = queryParams.toString();
  const url = `${appConfig.BACKEND_URL}/${appConfig.apiPrefix}/${
    appConfig.apiVersion1
  }/patients${queryString ? `?${queryString}` : ""}`;

  return get<PaginatedResponse<Patient>, void>(url);
};
