import axios from 'axios';
import {
    ICommunityInfo,
    IRecentTxAPI,
    IPaymentsTxAPI,
    IUser,
    STORAGE_USER_AUTH_TOKEN,
    STORAGE_USER_FIRST_TIME,
    IUserWelcome,
    IUserTxAPI,
    IUserWelcomeAuth,
} from 'helpers/types';
import { AsyncStorage, DevSettings } from 'react-native';

import config from '../../config';
import { writeLog } from './logger';

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
        writeLog({ action: 'get_request', details: error.message});
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
        writeLog({ action: 'post_request', details: error.message});
    }
    return response;
}

class Api {
    static async getAllValidCommunities(): Promise<ICommunityInfo[]> {
        const result = await getRequest<ICommunityInfo[]>(
            '/community/all/valid'
        );
        return result ? result : [];
    }

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
        txCreationObj: any,
    ): Promise<boolean> {
        const result = await postRequest<boolean>('/community/create', {
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
            txCreationObj,
        });
        return !!result;
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
        txCreationObj: any
    ): Promise<boolean> {
        const result = await postRequest<boolean>('/community/request', {
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
            txCreationObj,
        });
        return !!result;
    }

    static async editCommunity(
        publicId: string,
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

    /**
     * @deprecated
     */
    static async findComunityToBeneficicary(beneficiaryAddress: string) {
        return getRequest<ICommunityInfo>(
            `/transactions/beneficiaryin/${beneficiaryAddress}`
        );
    }

    /**
     * @deprecated
     */
    static async findComunityToManager(managerAddress: string) {
        return getRequest<ICommunityInfo>(
            `/transactions/managerin/${managerAddress}`
        );
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

    static async userTx(accountAddress: string): Promise<IUserTxAPI[]> {
        const result = await getRequest<IUserTxAPI[]>(
            `/transactions/usertx/${accountAddress}`
        );
        return result ? result : [];
    }

    /**
     * @deprecated
     */
    static async tokenTx(accountAddress: string): Promise<IRecentTxAPI[]> {
        const result = await getRequest<IRecentTxAPI[]>(
            `/transactions/tokentx/${accountAddress}`
        );
        return result ? result : [];
    }

    /**
     * @deprecated
     */
    static async paymentsTx(accountAddress: string): Promise<IPaymentsTxAPI[]> {
        const result = await getRequest<IPaymentsTxAPI[]>(
            `/transactions/paymentstx/${accountAddress}`
        );
        return result ? result : [];
    }

    /**
     * @deprecated Use 'welcome' instead.
     */
    static async getUser(address: string) {
        return getRequest<IUser>(`/user/${address}`);
    }

    static async welcome(address: string, token: string) {
        return postRequest<IUserWelcome>(`/user/welcome`, {
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

    /**
     * @deprecated Must use values from user storage and update when opening app.
     */
    static async getExchangeRate(): Promise<any> {
        const result = await getRequest<any>('/exchange-rates/');
        return result;
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
            writeLog({ action: 'upload_image_async', details: error.message});
        }
        return response;
    }

    static async userAuth(
        address: string,
        language: string,
        pushNotificationsToken: string
    ): Promise<IUserWelcomeAuth | undefined> {
        const result = await postRequest<IUserWelcomeAuth | undefined>('/user/auth', {
            address,
            language,
            pushNotificationsToken,
        });
        return result;
    }

    /**
     * @deprecated
     */
    static async setUserPushNotificationToken(
        address: string,
        token: string
    ): Promise<boolean> {
        const requestBody = {
            address,
            token,
        };
        const result = await postRequest<boolean>(
            '/user/push-notifications',
            requestBody
        );
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

    static async uploadLogs(
        logs: string,
    ): Promise<boolean> {
        const requestBody = {
            logs,
        };
        const result = await postRequest<boolean>(
            '/mobile-logs',
            requestBody
        );
        return !!result;
    }
}

export default Api;
