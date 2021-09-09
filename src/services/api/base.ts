import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { STORAGE_USER_AUTH_TOKEN } from 'helpers/constants';
import { AppMediaContent } from 'helpers/types/models';
import { DevSettings } from 'react-native';
import * as Sentry from 'sentry-expo';

import config from '../../../config';

axios.defaults.baseURL = config.baseApiUrl;

async function getRequest<T>(
    endpoint: string,
    useAuthToken = false
): Promise<T | undefined> {
    let response: T | undefined;
    try {
        let result;
        if (useAuthToken) {
            const token = await AsyncStorage.getItem(STORAGE_USER_AUTH_TOKEN);
            const requestOptions = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            result = await axios.get(endpoint, requestOptions);
        } else {
            result = await axios.get(endpoint);
        }
        if (result.status >= 400) {
            return undefined;
        }
        if (result.data === '') {
            // TODO: this condition should not exist
            response = undefined;
        } else {
            response = result.data as T;
        }
    } catch (e) {
        Sentry.Native.captureException(e);
    }
    return response;
}

async function putRequest<T>(
    endpoint: string,
    requestBody: any,
    options?: any
): Promise<T | undefined> {
    let response: T | undefined;
    try {
        // handle success
        const token = await AsyncStorage.getItem(STORAGE_USER_AUTH_TOKEN);
        const requestOptions = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            ...options,
        };
        const result = await axios.put(endpoint, requestBody, requestOptions);
        if (result.status === 401) {
            await AsyncStorage.clear();
            DevSettings.reload();
            return undefined;
        }
        if (result.status >= 400) {
            return undefined;
        }
        response = result.data as T;
    } catch (e) {
        Sentry.Native.captureException(e);
    }
    return response;
}

async function postRequest<T>(
    endpoint: string,
    requestBody: any,
    options?: any
): Promise<T | undefined> {
    let response: T | undefined;
    try {
        // handle success
        const token = await AsyncStorage.getItem(STORAGE_USER_AUTH_TOKEN);
        const requestOptions = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            ...options,
        };
        const result = await axios.post(endpoint, requestBody, requestOptions);
        if (result.status === 401) {
            await AsyncStorage.clear();
            DevSettings.reload();
            return undefined;
        }
        if (result.status >= 400) {
            return undefined;
        }

        response = result.data as T;
    } catch (e) {
        Sentry.Native.captureException(e);
    }
    return response;
}

async function deleteRequest<T>(
    endpoint: string,
    id?: any
): Promise<T | undefined> {
    let response: T | undefined;
    try {
        // handle success
        const token = await AsyncStorage.getItem(STORAGE_USER_AUTH_TOKEN);
        const requestOptions = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            data: { id },
        };
        const result = await axios.delete(endpoint, requestOptions);
        if (result.status === 401) {
            await AsyncStorage.clear();
            DevSettings.reload();
            return undefined;
        }
        if (result.status >= 400) {
            return undefined;
        }
        response = result.data as T;
    } catch (e) {
        Sentry.Native.captureException(e);
    }
    return response;
}

export interface IApiResult<T> {
    success: boolean;
    data: T;
    error: any;
    count: number;
}

class ApiRequests {
    // token: string | null = null;

    // constructor() {
    //     AsyncStorage.getItem(STORAGE_USER_AUTH_TOKEN).then(
    //         (r) => (this.token = r)
    //     );
    // }

    async get<T>(
        endpoint: string,
        useAuthToken = false
    ): Promise<{ data: T; count?: number }> {
        // try {
        let apiResult;
        if (useAuthToken) {
            // const requestOptions = {
            //     headers: {
            //         Authorization: `Bearer ${this.token}`,
            //         'Content-Type': 'application/json',
            //         Accept: 'application/json',
            //     },
            // };
            apiResult = await axios.get(endpoint, await this._requestOptions());
        } else {
            apiResult = await axios.get(endpoint);
        }
        // if (result.status >= 400) {
        //     return undefined;
        // }
        const r = apiResult.data as IApiResult<T>;
        let result: any = { data: r.data as T };
        if (r.count !== undefined) {
            result = { ...result, count: r.count };
        }
        return result;
        // } catch (e) {
        //     //
        //     return;
        // }
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
    ): Promise<{ data: T; error: any }> {
        // let response: T | undefined;
        // try {
        // handle success
        // const requestOptions = {
        //     headers: {
        //         Authorization: `Bearer ${this.token}`,
        //         'Content-Type': 'application/json',
        //         Accept: 'application/json',
        //     },
        //     ...options,
        // };
        const apiResult = await axios.put(
            endpoint,
            requestBody,
            await this._requestOptions(options)
        );
        //     if (result.status === 401) {
        //         await AsyncStorage.clear();
        //         DevSettings.reload();
        //         return undefined;
        //     }
        //     if (result.status >= 400) {
        //         return undefined;
        //     }
        //     response = result.data as T;
        const r = apiResult.data as IApiResult<T>;
        let result: any = { data: r.data as T };
        if (r.error !== undefined) {
            result = { ...result, error: r.error };
        }
        return result;
        // } catch (e) {
        //     Sentry.Native.captureException(e);
        // }
        // return response;
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

    head(endpoint: string) {
        try {
            const r = fetch(endpoint, { method: 'HEAD' });
            return r;
        } catch (e) {
            return {
                status: 404,
            };
        }
    }

    async uploadSingleImage(
        endpoint: string,
        mediaURI: string
    ): Promise<AppMediaContent> {
        // let response;
        // try {
        // handle success
        const uriParts = mediaURI.split('.');
        const fileType = uriParts[uriParts.length - 1];

        const formData = new FormData();
        if (mediaURI.length > 0) {
            formData.append('imageFile', {
                uri: mediaURI,
                name: `photo.${fileType}`,
                type: `image/${fileType}`,
            } as any);
        }
        const token = await AsyncStorage.getItem(STORAGE_USER_AUTH_TOKEN);
        const requestHeaders = {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        };
        const result = await axios.post(endpoint, formData, requestHeaders);
        const r = result.data as IApiResult<any>;
        return r.data as AppMediaContent;
        //     response = result.data;
        // } catch (e) {
        //     Sentry.Native.captureException(e);
        // }
        // return response;
    }

    private async _requestOptions(options?: any) {
        const token = await AsyncStorage.getItem(STORAGE_USER_AUTH_TOKEN);
        return {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            ...options,
        };
    }
}

export { getRequest, postRequest, deleteRequest, putRequest, ApiRequests };
