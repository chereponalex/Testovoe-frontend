import Axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";

const axios = Axios.create();

export const get = <R, Params = Record<string, unknown>>(
  url: string,
  params?: Params
): Promise<AxiosResponse<R>> => axios.get(url, { params });

export const post = <R, Data>(
  url: string,
  data?: Data,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<R>> => axios.post(url, data, config);

export const patch = <R, Data>(
  url: string,
  data: Data,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<R>> => axios.patch(url, data, config);

export const put = <R, Data>(
  url: string,
  data: Data,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<R>> => axios.put(url, data, config);

export const Delete = <R, Data>(
  url: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<R>> => axios.delete(url, config);
