import axios from 'axios';
import {
    ICommunityInfo,
    IRecentTxAPI,
    IPaymentsTxAPI,
    IUser,
    STORAGE_USER_AUTH_TOKEN,
    STORAGE_USER_FIRST_TIME,
} from 'helpers/types';
import { AsyncStorage, DevSettings } from 'react-native';

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
        // TODO: handle error
        // console.log(error);
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
        // handle error
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

    static async requestCreateCommunity(
        requestByAddress: string,
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
        coverImage: string,
        txCreationObj: any
    ): Promise<boolean> {
        const result = await postRequest<boolean>('/community/request', {
            requestByAddress,
            name,
            description,
            city,
            country,
            gps,
            email,
            visibility,
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

    static async findComunityToBeneficicary(beneficiaryAddress: string) {
        return getRequest<ICommunityInfo>(
            `/transactions/beneficiaryin/${beneficiaryAddress}`
        );
    }

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

    static async tokenTx(accountAddress: string): Promise<IRecentTxAPI[]> {
        const result = await getRequest<IRecentTxAPI[]>(
            `/transactions/tokentx/${accountAddress}`
        );
        return result ? result : [];
    }

    static async paymentsTx(accountAddress: string): Promise<IPaymentsTxAPI[]> {
        const result = await getRequest<IPaymentsTxAPI[]>(
            `/transactions/paymentstx/${accountAddress}`
        );
        return result ? result : [];
    }

    static async getUser(address: string) {
        return getRequest<IUser>(`/user/${address}`);
    }

    static async setUsername(
        address: string,
        username: string
    ): Promise<boolean> {
        const result = await postRequest('/user/username', {
            address,
            username,
        });
        return !!result;
    }

    static async setUserCurrency(
        address: string,
        currency: string
    ): Promise<boolean> {
        const result = await postRequest('/user/currency', {
            address,
            currency,
        });
        return !!result;
    }

    static async setLanguage(
        address: string,
        language: number
    ): Promise<boolean> {
        const result = await postRequest('/user/language', {
            address,
            language,
        });
        return !!result;
    }

    static async getExchangeRate(currency: string): Promise<number> {
        const result = await getRequest<any>(
            'https://api.exchangeratesapi.io/latest?base=USD'
        );
        return result ? result.rates[currency.toUpperCase()] : 1;
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
            // handle error
        } finally {
            // always executed
        }
        return response;
    }

    static async userAuth(
        address: string,
        pin: string
    ): Promise<string | undefined> {
        const requestBody = {
            address,
            pin,
        };
        const endpoint = '/user/auth';

        let response: string | undefined;
        try {
            // handle success
            const requestOptions = {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            };
            const result = await axios.post(
                endpoint,
                requestBody,
                requestOptions
            );
            if (result.status >= 400) {
                return undefined;
            }
            response = result.data as string;
        } catch (error) {
            // handle error
        }
        return response;
    }

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

    static async addClaimLocation(gps: any): Promise<boolean> {
        const requestBody = {
            gps,
        };
        const result = await postRequest<boolean>(
            '/claim-location',
            requestBody
        );
        return !!result;
    }
}

export default Api;
