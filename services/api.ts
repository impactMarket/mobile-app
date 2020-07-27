import axios from 'axios';
import config from '../config';
import {
    ICommunityInfo,
    IRecentTxAPI,
    IPaymentsTxAPI,
    IUser,
    STORAGE_USER_AUTH_TOKEN
} from '../helpers/types';
import { AsyncStorage } from 'react-native';


axios.defaults.baseURL = config.baseApiUrl;

async function getRequest<T>(endpoint: string): Promise<T | undefined> {
    let response: T | undefined;
    try {
        const result = await axios.get(endpoint);
        if (result.status >= 400) {
            return undefined;
        }
        if (result.data === "") {
            response = undefined;
        } else {
            response = result.data as T;
        }
    } catch (error) {
        // handle error
        console.log(error);
    }
    return response;
}

async function postRequest<T>(endpoint: string, requestBody: any, options?: any): Promise<T | undefined> {
    let response: T | undefined;
    try {
        // handle success
        const token = await AsyncStorage.getItem(STORAGE_USER_AUTH_TOKEN);
        const requestOptions = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            ...options
        };
        const result = await axios.post(endpoint, requestBody, requestOptions);
        if (result.status >= 400) {
            return undefined;
        }
        response = result.data as T;
    } catch (error) {
        // handle error
    }
    return response;
}


async function getAllValidCommunities(): Promise<ICommunityInfo[]> {
    let response = [] as ICommunityInfo[];
    try {
        // handle success
        const result = await axios.get('/community/all/valid')
        response = result.data;
    } catch (error) {
        // handle error
    } finally {
        // always executed
    }
    return response;
}

async function requestCreateCommunity(
    requestByAddress: string,
    name: string,
    description: string,
    city: string,
    country: string,
    gps: {
        latitude: number,
        longitude: number,
    },
    email: string,
    visibility: string,
    coverImage: string,
    txCreationObj: any,
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
    return result ? true : false;
}

async function editCommunity(
    publicId: string,
    name: string,
    description: string,
    city: string,
    country: string,
    gps: {
        latitude: number,
        longitude: number,
    },
    email: string,
    visibility: string,
    coverImage: string,
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
    return result ? true : false;
}

async function findComunityToBeneficicary(
    beneficiaryAddress: string,
) {
    return getRequest<ICommunityInfo>(
        `/transactions/beneficiaryin/${beneficiaryAddress}`
    );
}

async function findComunityToManager(
    managerAddress: string,
) {
    return getRequest<ICommunityInfo>(
        `/transactions/managerin/${managerAddress}`
    );
}

async function getCommunityByContractAddress(
    communityContractAddress: string,
): Promise<ICommunityInfo | undefined> {
    let response: ICommunityInfo = undefined as any;
    try {
        const result = await axios.get(`/community/address/${communityContractAddress}`);
        response = result.data as ICommunityInfo;
    } catch (error) {
        // handle error
    } finally {
        // always executed
    }
    return response;
}

async function getCommunityNamesFromAddresses(
    communitiesContractAddresses: string,
): Promise<{ contractAddress: string; name: string; }[]> {
    let response: { contractAddress: string; name: string; }[] = [];
    try {
        const result = await axios.get(`/community/getnames/${communitiesContractAddresses}`);
        response = result.data as { contractAddress: string; name: string; }[];
    } catch (error) {
        // handle error
    } finally {
        // always executed
    }
    return response;
}

async function tokenTx(
    accountAddress: string,
): Promise<IRecentTxAPI[]> {
    let response: IRecentTxAPI[] = [];
    try {
        const result = await axios.get(`/transactions/tokentx/${accountAddress}`);
        response = result.data as IRecentTxAPI[];
    } catch (error) {
        // handle error
    } finally {
        // always executed
    }
    return response;
}

async function paymentsTx(
    accountAddress: string,
): Promise<IPaymentsTxAPI[]> {
    let response: IPaymentsTxAPI[] = [];
    try {
        const result = await axios.get(`/transactions/paymentstx/${accountAddress}`);
        response = result.data as IPaymentsTxAPI[];
    } catch (error) {
        // handle error
    } finally {
        // always executed
    }
    return response;
}

async function getUser(
    address: string,
) {
    return getRequest<IUser>(
        `/user/${address}`
    );
}

async function setUsername(
    address: string,
    username: string,
): Promise<boolean> {
    const result = await postRequest('/user/username', {
        address,
        username
    });
    return result ? true : false;
}

async function setUserCurrency(
    address: string,
    currency: string,
): Promise<boolean> {
    const result = await postRequest('/user/currency', {
        address,
        currency
    });
    return result ? true : false;
}

async function setLanguage(
    address: string,
    language: number,
): Promise<boolean> {
    const result = await postRequest('/user/language', {
        address,
        language
    });
    return result ? true : false;
}

async function getExchangeRate(
    currency: string,
): Promise<number> {
    let response = 1;
    try {
        const result = await axios.get('https://api.exchangeratesapi.io/latest?base=USD');
        response = result.data.rates[currency.toUpperCase()] as number;
    } catch (error) {
        // handle error
    } finally {
        // always executed
    }
    return response;
}

async function uploadImageAsync(uri: string) {
    let response;
    try {
        // handle success
        let uriParts = uri.split('.');
        let fileType = uriParts[uriParts.length - 1];

        let formData = new FormData();
        formData.append('photo', {
            uri,
            name: `photo.${fileType}`,
            type: `image/${fileType}`,
        } as any);
        const token = await AsyncStorage.getItem(STORAGE_USER_AUTH_TOKEN);
        const requestHeaders = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            }
        };
        const result = await axios.post('/s3/upload', formData, requestHeaders);
        response = result;
    } catch (error) {
        // handle error
    } finally {
        // always executed
    }
    return response;
}

async function userAuth(
    address: string,
    pin: string,
): Promise<string | undefined> {
    const requestBody = {
        address,
        pin,
    };
    return postRequest<string>('/user/auth', requestBody);
}

async function setUserPushNotificationToken(
    address: string,
    token: string,
): Promise<boolean> {
    const requestBody = {
        address,
        token,
    };
    const result = await postRequest<boolean>('/user/push-notifications', requestBody);
    return result ? true : false;
}

async function addClaimLocation(
    gps: any,
): Promise<boolean> {
    const requestBody = {
        gps
    };
    const result = await postRequest<boolean>('/claim-location', requestBody);
    return result ? true : false;
}

export {
    getAllValidCommunities,
    requestCreateCommunity,
    editCommunity,
    findComunityToBeneficicary,
    findComunityToManager,
    getCommunityByContractAddress,
    getCommunityNamesFromAddresses,
    tokenTx,
    paymentsTx,
    getUser,
    setUsername,
    setUserCurrency,
    setLanguage,
    getExchangeRate,
    uploadImageAsync,
    userAuth,
    setUserPushNotificationToken,
    addClaimLocation,
}