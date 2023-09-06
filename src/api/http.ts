import axios from 'axios';
import { getStorageData } from '../app/app.utils';

import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import type { IUserData } from '../entities/user/model/user.types';

export class Http {
  client: AxiosInstance;

  token = '';

  constructor() {
    const baseUrl = 'https://api.preemiesensor.com/v1/preemie/';

    this.client = axios.create({
      baseURL: baseUrl,
    });
  }

  private getUser = async (): Promise<IUserData | null> => {
    const state = await getStorageData();
    const { user } = state || { user: null };
    return user;
  };

  private getHeader = async (headers: Record<string, string>) => {
    const composedHeaders = {
      Accept: 'application/json, application/xml, text/plain, text/html, *.*',
      'Content-type': 'application/json;charset=UTF-8',
      ...headers,
    };

    const state = await getStorageData();
    const { token } = state?.user || { token: null };

    if (token) {
      return Object.assign(composedHeaders, {
        Authorization: `Token ${token}`,
      });
    }

    return composedHeaders;
  };

  get = async (
    pathUrl: string,
    query: Record<string, any> = {},
    header: Record<string, string> = {}
  ): Promise<any | void> => {
    const args = {
      method: 'GET',
      headers: await this.getHeader(header),
      url: pathUrl,
      params: query,
      responseType: 'json',
    };

    // make sure that we append the users group id
    const user = await this.getUser();

    if (user?.metadata?.group_id) {
      args.params.preemie_group_id = user.metadata.group_id;
    }

    return this.request(args);
  };

  post = async (
    pathUrl: string,
    data: Record<string, any> = {},
    query: Record<string, any> = {},
    header: Record<string, string> = {}
  ): Promise<any | void> => {
    const args = {
      method: 'POST',
      headers: await this.getHeader(header),
      data,
      params: query,
      responseType: 'json',
      url: pathUrl,
    };

    // make sure that we append the users group id
    const user = await this.getUser();

    if (user?.metadata?.group_id) {
      args.params.preemie_group_id = user.metadata.group_id;
    }

    return this.request(args);
  };

  patch = async (
    pathUrl: string,
    data: Record<string, any> = {},
    query: Record<string, any> = {},
    header: Record<string, string> = {}
  ): Promise<any | void> => {
    const args = {
      method: 'PATCH',
      headers: await this.getHeader(header),
      data,
      params: query,
      responseType: 'json',
      url: pathUrl,
    };

    // make sure that we append the users group id
    const user = await this.getUser();

    if (user?.metadata?.group_id) {
      args.params.preemie_group_id = user.metadata.group_id;
    }

    return this.request(args);
  };

  delete = async (pathUrl: string, query: any = {}, header: any = {}): Promise<any | void> => {
    const args = {
      method: 'DELETE',
      headers: await this.getHeader(header),
      url: pathUrl,
      params: query,
      responseType: 'json',
    };

    return this.request(args);
  };

  private request = async (args: any): Promise<any> => {
    try {
      const response = await this.client(args);
      return this.parseApiSuccess(response);
    } catch (e) {
      return this.parseApiError(e as AxiosError);
    }
  };

  private parseApiError = (error: AxiosError<any>) => {
    if (error.response && error.response.data) {
      return {
        data: null,
        error: {
          code: error.response.status,
          message: error.response.data,
        },
      };
    }
    return 'unknown';
  };

  private parseApiSuccess = (response: AxiosResponse<any>) => {
    if (response && response.data) {
      return {
        data: response.data,
        error: null,
      };
    }

    throw new Error('No data to response');
  };
}
