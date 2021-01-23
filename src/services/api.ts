import axios from 'axios';
import { DevSettings } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

import config from '../../config';
import {
    CommunityCreationAttributes,
    ICommunity,
    ICommunityLightDetails,
    IUserHello,
    IUserAuth,
    IManagerDetailsBeneficiary,
    IManagerDetailsManager,
} from 'helpers/types/endpoints';
import { STORAGE_USER_AUTH_TOKEN } from 'helpers/constants';

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
    } catch (error) {
        // Api.system.uploadError('', 'get_request', error);
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
    } catch (error) {
        // Api.system.uploadError('', 'post_request', error);
    }
    return response;
}

class ApiRouteCommunity {
    static async searchBeneficiary(active: boolean, beneficiaryQuery: string) {
        const result = await getRequest<IManagerDetailsBeneficiary[]>(
            '/community/beneficiaries/search/' +
                (active ? 'true' : 'false') +
                '/' +
                beneficiaryQuery,
            true
        );
        console.log('result', result);
        if (result) {
            return result;
        }
        throw new Error("Can't load '/beneficiary/search'");
    }

    static async searchManager(managerQuery: string) {
        const result = await getRequest<IManagerDetailsManager[]>(
            '/community/managers/search/' + managerQuery,
            true
        );
        console.log('result', result);
        if (result) {
            return result;
        }
        throw new Error("Can't load '/managers/search'");
    }

    static async listBeneficiaries(
        active: boolean,
        offset: number,
        limit: number
    ) {
        const result = await getRequest<IManagerDetailsBeneficiary[]>(
            '/community/beneficiaries/list/' +
                active +
                '/' +
                offset +
                '/' +
                limit,
            true
        );
        if (result) {
            return result;
        }
        throw new Error("Can't load '/beneficiary/search'");
    }

    static async listManagers(offset: number, limit: number) {
        const result = await getRequest<IManagerDetailsManager[]>(
            '/community/managers/list/' + offset + '/' + limit,
            true
        );
        if (result) {
            return result;
        }
        throw new Error("Can't load '/manager/search'");
    }

    static async listNearest(
        lat: number,
        lng: number,
        offset: number,
        limit: number
    ) {
        const result = await getRequest<ICommunityLightDetails[]>(
            '/community/list/light?order=nearest&lat=' +
                lat +
                '&lng=' +
                lng +
                '&offset=' +
                offset +
                '&limit=' +
                limit
        );
        return result ? result : [];
    }
    static async list(offset: number, limit: number) {
        const result = await getRequest<ICommunityLightDetails[]>(
            '/community/list/light?offset=' + offset + '&limit=' + limit
        );
        return result ? result : [];
    }

    static async getByPublicId(
        publicId: string
    ): Promise<ICommunity | undefined> {
        return await getRequest<ICommunity>('/community/publicid/' + publicId);
    }

    static async getByContractAddress(
        address: string
    ): Promise<ICommunity | undefined> {
        return await getRequest<ICommunity>('/community/contract/' + address);
    }

    static async getHistoricalSSI(publicId: string): Promise<number[]> {
        const result = await getRequest<number[]>(
            '/community/hssi/' + publicId
        );
        return result ? result : [];
    }

    static async create(
        details: CommunityCreationAttributes
    ): Promise<ICommunity | undefined> {
        return await postRequest<ICommunity>('/community/add', details);
    }
}

class ApiRouteUser {
    static async hello(
        address: string,
        token: string
    ): Promise<IUserHello | undefined> {
        return postRequest<IUserHello>(`/user/hello`, {
            address,
            token,
        });
    }

    static async auth(
        address: string,
        language: string,
        pushNotificationToken: string
    ): Promise<IUserAuth | undefined> {
        return await postRequest<IUserAuth>('/user/authenticate', {
            address,
            language,
            pushNotificationToken,
        });
    }

    static async addClaimLocation(
        communityId: string,
        gps: any
    ): Promise<boolean> {
        const requestBody = {
            communityId,
            gps,
        };
        const result = await postRequest<boolean>(
            '/claim-location',
            requestBody
        );
        return !!result;
    }

    static async exists(address: string): Promise<boolean> {
        return !!(await getRequest<boolean>('/user/exists/' + address));
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

    static async setCurrency(
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

    static async setGender(address: string, gender: string): Promise<boolean> {
        const result = await postRequest<boolean>('/user/gender', {
            address,
            gender,
        });
        return !!result;
    }

    static async setAge(address: string, age: number): Promise<boolean> {
        const result = await postRequest<boolean>('/user/age', {
            address,
            age,
        });
        return !!result;
    }

    static async setChildren(
        address: string,
        children: number | null
    ): Promise<boolean> {
        const result = await postRequest<boolean>('/user/children', {
            address,
            children,
        });
        return !!result;
    }
}

class ApiRouteUpload {
    static async uploadCommunityCoverImage(communityId: string, uri: string) {
        let response;
        try {
            // handle success
            const uriParts = uri.split('.');
            const fileType = uriParts[uriParts.length - 1];

            const formData = new FormData();
            formData.append('imageFile', {
                uri,
                name: `photo.${fileType}`,
                type: `image/${fileType}`,
            } as any);
            formData.append('pictureContext', 'community');
            formData.append('communityId', communityId);
            const token = await AsyncStorage.getItem(STORAGE_USER_AUTH_TOKEN);
            const requestHeaders = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            };
            const result = await axios.post(
                '/storage/upload',
                formData,
                requestHeaders
            );
            response = result;
        } catch (error) {
            Api.system.uploadError('', 'uploadCommunityCoverImage', error);
        }
        return response;
    }
}

class ApiRouteSystem {
    static async getServerTime(): Promise<number> {
        const result = await getRequest<number>('/clock');
        return result ? result : 0;
    }

    /**
     * Must use values from user storage and update when opening app.
     */
    static async getExchangeRate(): Promise<{ currency: string, rate: number }[]> {
        const result = await getRequest<{
            rates: { currency: string; rate: number }[];
        }>('/exchange-rates');
        return result ? result.rates : [];
    }

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

class Api {
    public static community = ApiRouteCommunity;
    public static user = ApiRouteUser;
    public static upload = ApiRouteUpload;
    public static system = ApiRouteSystem;
}

export default Api;
