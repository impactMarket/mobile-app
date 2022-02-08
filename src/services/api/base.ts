import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosResponse } from 'axios';
import {
    STORAGE_USER_ADDRESS,
    STORAGE_USER_AUTH_TOKEN,
    STORAGE_USER_PHONE_NUMBER,
} from 'helpers/constants';
import { ApiErrorReturn, IUserAuth } from 'helpers/types/endpoints';
import { AppMediaContent } from 'helpers/types/models';

import config from '../../../config';

const AxiosInstance = axios.create({
    baseURL: config.baseApiUrl,
    timeout: 20000,
});

AxiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (!error.response) {
            return Promise.reject(new Error('Network Error'));
        } else if (
            (error.response.status === 401 || error.response.status === 403) &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            const address = await AsyncStorage.getItem(STORAGE_USER_ADDRESS);
            const phone = await AsyncStorage.getItem(STORAGE_USER_PHONE_NUMBER);
            return AxiosInstance.post<
                { address: string; phone: string },
                AxiosResponse<{ data: IUserAuth }>
            >('/user/auth', {
                address,
                phone,
            })
                .then((response) => {
                    const authTokenResponse = response.data.data.token;
                    AsyncStorage.setItem(
                        STORAGE_USER_AUTH_TOKEN,
                        authTokenResponse
                    );
                })
                .catch((err) => err);
        } else {
            return error.response;
        }
    }
);

export default AxiosInstance;

async function _requestOptions(options?: any) {
    return {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${await AsyncStorage.getItem(
                STORAGE_USER_AUTH_TOKEN
            )}`,
        },
        ...options,
    };
}

export interface IApiResult<T> {
    success: boolean;
    data: T;
    error: ApiErrorReturn;
    count: number;
}

export const ApiRequests = {
    async get<T>(endpoint: string): Promise<IApiResult<T>> {
        try {
            AxiosInstance.defaults.headers.common[
                'Authorization'
            ] = `Bearer ${await AsyncStorage.getItem(STORAGE_USER_AUTH_TOKEN)}`;
            return (await AxiosInstance.get(endpoint)).data;
        } catch (e) {
            return e.response.data;
        }
    },

    async post<T>(
        endpoint: string,
        requestBody: any,
        options?: any
    ): Promise<IApiResult<T>> {
        try {
            return (
                await AxiosInstance.post<IApiResult<T>>(
                    endpoint,
                    requestBody,
                    await _requestOptions(options)
                )
            ).data;
        } catch (e) {
            return e.response.data;
        }
    },

    async put<T>(
        endpoint: string,
        requestBody: any,
        options?: any
    ): Promise<IApiResult<T>> {
        try {
            return (
                await AxiosInstance.put(
                    endpoint,
                    requestBody,
                    await _requestOptions(options)
                )
            ).data;
        } catch (e) {
            return e.response.data;
        }
    },

    async delete<T>(endpoint: string, id?: any): Promise<IApiResult<T>> {
        try {
            return (
                await AxiosInstance.delete<IApiResult<T>>(
                    endpoint,
                    await _requestOptions({ data: { id } })
                )
            ).data;
        } catch (e) {
            return e.response.data;
        }
    },

    async head(endpoint: string) {
        try {
            return await AxiosInstance.head(endpoint);
        } catch (e) {
            return {
                status: 404,
            };
        }
    },

    async uploadImage(
        preSigned: { uploadURL: string; media: AppMediaContent },
        uri: string
    ) {
        const resp = await fetch(uri);
        const imageBody = await resp.blob();

        const result = await fetch(preSigned.uploadURL, {
            method: 'PUT',
            body: imageBody,
        });
        if (result.status >= 400) {
            throw new Error('not uploaded');
        }
        // wait until image exists on real endpoint
        // TODO: improve this
        const delay = (ms: number) =>
            new Promise((resolve) => setTimeout(resolve, ms));
        let tries = 30;
        while (tries-- > 0) {
            await delay(1000);
            const { status } = await ApiRequests.head(preSigned.media.url);
            if (status === 200) {
                return true;
            }
        }
        return false;
    },
};
