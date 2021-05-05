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

interface IApiResult {
    success: boolean;
    data: any;
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

    async get<T>(endpoint: string, useAuthToken = false): Promise<T> {
        // try {
        let result;
        if (useAuthToken) {
            // const requestOptions = {
            //     headers: {
            //         Authorization: `Bearer ${this.token}`,
            //         'Content-Type': 'application/json',
            //         Accept: 'application/json',
            //     },
            // };
            result = await axios.get(endpoint, await this._requestOptions());
        } else {
            result = await axios.get(endpoint);
        }
        // if (result.status >= 400) {
        //     return undefined;
        // }
        const r = result.data as IApiResult;
        return r.data as T;
        // } catch (e) {
        //     //
        //     return;
        // }
    }

    async post<T>(
        endpoint: string,
        requestBody: any,
        options?: any
    ): Promise<T> {
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
        const result = await axios.post(
            endpoint,
            requestBody,
            await this._requestOptions(options)
        );
        // if (result.status === 401) {
        //     await AsyncStorage.clear();
        //     DevSettings.reload();
        //     return undefined;
        // }
        // if (result.status >= 400) {
        //     return undefined;
        // }
        const r = result.data as IApiResult;
        return r.data as T;
        // } catch (e) {
        //     Sentry.Native.captureException(e);
        // }
        // return response;
    }

    async put<T>(
        endpoint: string,
        requestBody: any,
        options?: any
    ): Promise<T> {
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
        const result = await axios.put(
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
        const r = result.data as IApiResult;
        return r.data as T;
        // } catch (e) {
        //     Sentry.Native.captureException(e);
        // }
        // return response;
    }

    async delete<T>(endpoint: string, id?: any): Promise<T> {
        // let response: T | undefined;
        // try {
        // handle success
        // const requestOptions = {
        //     headers: {
        //         Authorization: `Bearer ${this.token}`,
        //         'Content-Type': 'application/json',
        //         Accept: 'application/json',
        //     },
        //     data: { id },
        // };
        const result = await axios.delete(
            endpoint,
            await this._requestOptions({ data: { id } })
        );
        // if (result.status === 401) {
        //     await AsyncStorage.clear();
        //     DevSettings.reload();
        //     return undefined;
        // }
        // if (result.status >= 400) {
        //     return undefined;
        // }
        // response = result.data as T;
        const r = result.data as IApiResult;
        return r.data as T;
        // } catch (e) {
        //     Sentry.Native.captureException(e);
        // }
        // return response;
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
        // console.log(mediaURI.length);
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
        const r = result.data as IApiResult;
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
