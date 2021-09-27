import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { STORAGE_USER_AUTH_TOKEN } from 'helpers/constants';
import { ApiErrorReturn } from 'helpers/types/endpoints';

import config from '../../../config';

axios.defaults.baseURL = config.baseApiUrl;

export interface IApiResult<T> {
    success: boolean;
    data: T;
    error: ApiErrorReturn;
    count: number;
}

export class ApiRequests {
    private token: string | null = null;

    constructor() {
        AsyncStorage.getItem(STORAGE_USER_AUTH_TOKEN).then(
            (r) => (this.token = r)
        );
    }

    async get<T>(endpoint: string): Promise<IApiResult<T>> {
        try {
            let apiResult;
            if (this.token) {
                apiResult = await axios.get(
                    endpoint,
                    await this._requestOptions()
                );
            } else {
                apiResult = await axios.get(endpoint);
            }
            return apiResult.data;
        } catch (e) {
            return e.response.data;
        }
    }

    async post<T>(
        endpoint: string,
        requestBody: any,
        options?: any
    ): Promise<IApiResult<T>> {
        try {
            return (
                await axios.post<IApiResult<T>>(
                    endpoint,
                    requestBody,
                    await this._requestOptions(options)
                )
            ).data;
        } catch (e) {
            return e.response.data;
        }
    }

    async put<T>(
        endpoint: string,
        requestBody: any,
        options?: any
    ): Promise<IApiResult<T>> {
        try {
            return (
                await axios.put(
                    endpoint,
                    requestBody,
                    await this._requestOptions(options)
                )
            ).data;
        } catch (e) {
            return e.response.data;
        }
    }

    async delete<T>(endpoint: string, id?: any): Promise<IApiResult<T>> {
        try {
            return (
                await axios.delete<IApiResult<T>>(
                    endpoint,
                    await this._requestOptions({ data: { id } })
                )
            ).data;
        } catch (e) {
            return e.response.data;
        }
    }

    async head(endpoint: string) {
        try {
            return await axios.head(endpoint);
        } catch (e) {
            return {
                status: 404,
            };
        }
    }

    private async _requestOptions(options?: any) {
        return {
            headers: {
                Authorization: `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            ...options,
        };
    }
}
