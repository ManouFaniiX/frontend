import { ApiResponse, Meta } from "@/interfaces/global";
import { axiosCredential, catchAxios } from "@/lib/axios";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import qs from "qs";

export type DefaultSearchParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export const genericDelete = async (url: string, id: string | number) => {
  try {
    const response: AxiosResponse<ApiResponse<string> | undefined | null> =
      await axiosCredential.delete(`${url}/${id}`);
      
    if (response.data && response.data.success === false) {
      throw new Error(response.data.message || "An unknown error occurred");
    }

    return response.data?.data;
  } catch (error) {
    catchAxios(error);
  }
};

export const genericUpdate = async <TUpdate, TResponse>(
  baseUrl: string,
  id: string,
  data: TUpdate,
  headers?: Record<string, string>
): Promise<TResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse<TResponse>> =
      await axiosCredential.put(`${baseUrl}/${id}`, data, {
        headers,
      });

    if (!response.data.success) {
      throw new Error(response.data.message || "An unknown error occurred");
    }

    return response.data.data;
  } catch (error) {
    catchAxios(error);
  }
};

export const genericCreate = async <TNewData, TResponse>(
  baseUrl: string,
  newData: TNewData,
  config?: AxiosRequestConfig
) => {
  try {
    const response: AxiosResponse<ApiResponse<TResponse>> =
      await axiosCredential.post(baseUrl, newData, config);

      if (!response.data.success)
      throw new Error(response.data.message || "An unknown error occurred");

    return response.data.data;
  } catch (error) {
    catchAxios(error);
  }
};

export async function genericGetList<T, TParams = AxiosRequestConfig["params"]>(
  url: string,
  params?: TParams
): Promise<{ meta?: Meta; data: T[] } | undefined > {
  try {
    const response: AxiosResponse<ApiResponse<T[]>> =
      await axiosCredential.get(url, {
        params,
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      });

    if (!response.data.data)
      throw new Error(response.data.message || "An error occurred");

    return {
      data: response.data.data,
      meta: response.data.meta,
    }
  } catch (error) {
    catchAxios(error);
  }
}

export async function genericGetListData<T, TParams = AxiosRequestConfig["params"]>(
  url: string,
  params?: TParams
): Promise<{ meta?: Meta; data: T } | undefined> {
  try {
    const response: AxiosResponse<ApiResponse<T>> =
      await axiosCredential.get(url, {
        params,
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      });

    if (!response.data.data)
      throw new Error(response.data.message || "An error occurred");

    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  } catch (error) {
    catchAxios(error);
  }
}

export async function genericGetOne<T>(
  url: string,
  id: string
): Promise<T | undefined> {
  try {  
    const response: AxiosResponse<ApiResponse<T>> =
      await axiosCredential.get(`${url}/${id}`);
    if (!response.data.data)
      throw new Error(response.data.message || "An error occurred");
    
    return response.data.data;
  } catch (error) {
    catchAxios(error);
  }
}

export const genericPut = async <TPayload, TResponse>(
  url: string,
  data: TPayload,
  config?: AxiosRequestConfig
): Promise<TResponse | undefined> => {
  try {
    const response: AxiosResponse<ApiResponse<TResponse>> =
      await axiosCredential.put(url, data, config);

    if (!response.data.success) {
      throw new Error(response.data.message || "An unknown error occurred");
    }

    return response.data.data;
  } catch (error) {
    catchAxios(error);
  }
};