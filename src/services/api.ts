import axios from 'axios';
import {
    ICommunityInfo,
    STORAGE_USER_AUTH_TOKEN,
    STORAGE_USER_FIRST_TIME,
    IUserWelcome,
    IUserWelcomeAuth,
    ICommunity,
    ICommunityContractParams,
} from 'helpers/types';
import { AsyncStorage, DevSettings } from 'react-native';
import Constants from 'expo-constants';

import config from '../../config';

axios.defaults.baseURL = config.baseApiUrl;

async function getRequest<T>(endpoint: string): Promise<T | undefined> {
    let response: T | undefined;
    try {
        const result = await axios.get(endpoint);
        if (result.status >= 400) {
            return undefined;
        }
        if (result.data === '') {
            response = undefined;
        } else {
            response = result.data as T;
        }
    } catch (error) {
        Api.uploadError('', 'get_request', error);
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
            await AsyncStorage.setItem(STORAGE_USER_FIRST_TIME, 'false');
            DevSettings.reload();
            return undefined;
        }
        if (result.status >= 400) {
            return undefined;
        }
        response = result.data as T;
    } catch (error) {
        Api.uploadError('', 'post_request', error);
    }
    return response;
}

class Api {
    // community

    static async createPrivateCommunity(
        requestByAddress: string,
        name: string,
        contractAddress: string,
        description: string,
        language: string,
        currency: string,
        city: string,
        country: string,
        gps: {
            latitude: number;
            longitude: number;
        },
        email: string,
        coverImage: string,
        txReceipt: any,
        contractParams: ICommunityContractParams,
    ): Promise<ICommunity | undefined> {
        return await postRequest<ICommunity>('/community/create', {
            requestByAddress,
            name,
            contractAddress,
            description,
            language,
            currency,
            city,
            country,
            gps,
            email,
            coverImage,
            txReceipt,
            contractParams,
        });
    }

    static async requestCreatePublicCommunity(
        requestByAddress: string,
        name: string,
        description: string,
        language: string,
        currency: string,
        city: string,
        country: string,
        gps: {
            latitude: number;
            longitude: number;
        },
        email: string,
        coverImage: string,
        contractParams: ICommunityContractParams,
    ): Promise<ICommunity | undefined> {
        return await postRequest<ICommunity>('/community/request', {
            requestByAddress,
            name,
            description,
            language,
            currency,
            city,
            country,
            gps,
            email,
            coverImage,
            contractParams,
        });
    }

    static async editCommunity(
        publicId: string,
        userAddress: string,
        name: string,
        description: string,
        city: string,
        country: string,
        gps: {
            latitude: number;
            longitude: number;
        },
        email: string,
        visibility: string,
        coverImage: string
    ): Promise<boolean> {
        const result = await postRequest('/community/edit', {
            publicId,
            userAddress,
            name,
            description,
            city,
            country,
            gps,
            email,
            visibility,
            coverImage,
        });
        return !!result;
    }

    static async uploadImageAsync(uri: string) {
        let response;
        try {
            // handle success
            const uriParts = uri.split('.');
            const fileType = uriParts[uriParts.length - 1];

            const formData = new FormData();
            formData.append('photo', {
                uri,
                name: `photo.${fileType}`,
                type: `image/${fileType}`,
            } as any);
            const token = await AsyncStorage.getItem(STORAGE_USER_AUTH_TOKEN);
            const requestHeaders = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            };
            const result = await axios.post(
                '/s3/upload',
                formData,
                requestHeaders
            );
            response = result;
        } catch (error) {
            Api.uploadError('', 'upload_image_async', error);
        }
        return response;
    }

    static async getAllValidCommunities(): Promise<ICommunityInfo[]> {
        const result = await getRequest<ICommunityInfo[]>(
            '/community/all/valid'
        );
        return result ? result : [];
    }

    static async getCommunityByPublicId(
        publicId: string
    ): Promise<ICommunityInfo | undefined> {
        return await getRequest<ICommunityInfo>('/community/id/' + publicId);
    }

    static async getCommunityByContractAddress(
        communityContractAddress: string
    ): Promise<ICommunityInfo | undefined> {
        return getRequest<ICommunityInfo>(
            `/community/address/${communityContractAddress}`
        );
    }

    static async getCommunityNamesFromAddresses(
        communitiesContractAddresses: string
    ): Promise<{ contractAddress: string; name: string }[]> {
        const result = await getRequest<
            { contractAddress: string; name: string }[]
        >(`/community/getnames/${communitiesContractAddresses}`);
        return result ? result : [];
    }

    // user

    static async userAuth(
        address: string,
        language: string,
        pushNotificationsToken: string
    ): Promise<IUserWelcomeAuth | undefined> {
        return await postRequest<IUserWelcomeAuth | undefined>('/user/auth', {
            authKey: process.env.EXPO_AUTH_KEY,
            address,
            language,
            pushNotificationsToken,
        });
    }

    static async welcome(address: string, token: string) {
        return postRequest<IUserWelcome>(`/user/welcome`, {
            authKey: process.env.EXPO_AUTH_KEY,
            address,
            token,
        });
    }

    static async setUsername(
        address: string,
        username: string
    ): Promise<boolean> {
        const result = await postRequest<boolean>('/user/username', {
            address,
            username,
        });
        return !!result;
    }

    static async setUserCurrency(
        address: string,
        currency: string
    ): Promise<boolean> {
        const result = await postRequest<boolean>('/user/currency', {
            address,
            currency,
        });
        return !!result;
    }

    static async setLanguage(
        address: string,
        language: string
    ): Promise<boolean> {
        const result = await postRequest<boolean>('/user/language', {
            address,
            language,
        });
        return !!result;
    }

    static async addClaimLocation(
        communityPublicId: string,
        gps: any
    ): Promise<boolean> {
        const requestBody = {
            communityPublicId,
            gps,
        };
        const result = await postRequest<boolean>(
            '/claim-location',
            requestBody
        );
        return !!result;
    }

    // app

    /**
     * Must use values from user storage and update when opening app.
     */
    static async getExchangeRate(): Promise<any> {
        const result = await getRequest<any>('/exchange-rates/');
        return result;
    }

    // misc

    static async uploadError(
        address: string,
        action: string,
        error: any
    ): Promise<boolean> {
        const requestBody = {
            version: Constants.manifest.version,
            address,
            action,
            error: JSON.stringify({
                reason: error.reason,
                message: error.message,
            }),
        };
        const result = await postRequest<boolean>('/mobile/error', requestBody);
        return !!result;
    }

    /**
     * if undefined here happens, it means there's a connection problem
     */
    static async getMobileVersion(): Promise<
        | {
              latest: string;
              minimal: string;
              timestamp: number;
          }
        | undefined
    > {
        return await getRequest<any>('/mobile/version');
    }
}

export default Api;
