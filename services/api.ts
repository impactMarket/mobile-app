import axios from 'axios';
import config from '../config';
import {
    ICommunityInfo,
    IRecentTxAPI,
    IPaymentsTxAPI,
    IUser
} from '../helpers/types';


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

async function postRequest<T>(endpoint: string, requestBody: any): Promise<T | undefined> {
    let response: T | undefined;
    try {
        // handle success
        const requestHeaders = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        };
        const result = await axios.post(endpoint, requestBody, requestHeaders);
        if (result.status >= 400) {
            return undefined;
        }
        response = result.data as T;
    } catch (error) {
        // handle error
    } finally {
        // always executed
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
    let response = 500;
    try {
        // handle success
        const requestBody = {
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
        };
        const requestHeaders = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        };
        const result = await axios.post('/community/request', requestBody, requestHeaders);
        response = result.status;
    } catch (error) {
        // handle error
    } finally {
        // always executed
    }
    return response === 200 ? true : false;
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
    let response = 500;
    try {
        // handle success
        const requestBody = {
            publicId,
            name,
            description,
            city,
            country,
            gps,
            email,
            visibility,
            coverImage,
        };
        const requestHeaders = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        };
        const result = await axios.post('/community/edit', requestBody, requestHeaders);
        response = result.status;
    } catch (error) {
        // handle error
    } finally {
        // always executed
    }
    return response === 200 ? true : false;
}

async function requestJoinAsBeneficiary(
    walletAddress: string,
    communityPublicId: string,
): Promise<boolean> {
    let response = 500;
    try {
        // handle success
        const requestBody = {
            walletAddress,
            communityPublicId
        };
        const requestHeaders = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        };
        const result = await axios.post('/beneficiary/request', requestBody, requestHeaders);
        response = result.status;
    } catch (error) {
        // handle error
    } finally {
        // always executed
    }
    return response === 200 ? true : false;
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

async function acceptBeneficiaryRequest(
    acceptanceTransaction: string,
    communityPublicId: string,
): Promise<boolean> {
    let response = 500;
    try {
        // handle success
        const requestBody = {
            acceptanceTransaction,
            communityPublicId
        };
        const requestHeaders = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        };
        const result = await axios.post('/beneficiary/accept', requestBody, requestHeaders);
        response = result.status;
    } catch (error) {
        // handle error
    } finally {
        // always executed
    }
    return response === 200 ? true : false;
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
    let response = 500;
    try {
        // handle success
        const requestBody = {
            address,
            username
        };
        const requestHeaders = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        };
        const result = await axios.post('/user/username', requestBody, requestHeaders);
        response = result.status;
    } catch (error) {
        // handle error
    } finally {
        // always executed
    }
    return response === 200 ? true : false;
}

async function setUserCurrency(
    address: string,
    currency: string,
): Promise<boolean> {
    let response = 500;
    try {
        // handle success
        const requestBody = {
            address,
            currency
        };
        const requestHeaders = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        };
        const result = await axios.post('/user/currency', requestBody, requestHeaders);
        response = result.status;
    } catch (error) {
        // handle error
    } finally {
        // always executed
    }
    return response === 200 ? true : false;
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
        const requestHeaders = {
            headers: {
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
    signature: string,
): Promise<string | undefined> {
    const requestBody = {
        address,
        signature,
    };
    return postRequest<string>('/user/auth', requestBody);
}

export {
    getAllValidCommunities,
    requestCreateCommunity,
    editCommunity,
    requestJoinAsBeneficiary,
    findComunityToBeneficicary,
    findComunityToManager,
    acceptBeneficiaryRequest,
    getCommunityByContractAddress,
    getCommunityNamesFromAddresses,
    tokenTx,
    paymentsTx,
    getUser,
    setUsername,
    setUserCurrency,
    getExchangeRate,
    uploadImageAsync,
    userAuth,
}